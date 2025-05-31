import { Request, Response, NextFunction } from 'express';
import { Scan, IScan, IHistoryEntry } from '../models/scan.model';

interface ScanResponse {
  message?: string;
  data?: any;
  error?: string;
}

// Helper function to generate mock historical data if none exists
const generateMockHistory = (dailyTarget: number, achieved: number): IHistoryEntry[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const history: IHistoryEntry[] = [];
  
  for (let i = 0; i < 7; i++) {
    const mockAchieved = i === 6 ? achieved : Math.floor(Math.random() * (dailyTarget * 1.2));
    history.push({
      day: days[i],
      target: dailyTarget,
      achieved: mockAchieved,
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000) // Last 7 days
    });
  }
  
  return history;
};

// Helper function to get current day name
const getCurrentDayName = (): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date().getDay()];
};

export const getScanData = async (
  req: Request,
  res: Response<ScanResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    let scanData = await Scan.findOne().sort({ timestamp: -1 }).lean();
   
    if (!scanData) {
      res.status(404).json({ message: 'Scan data not found' });
      return;
    }

    // If no history exists, generate it
    if (!scanData.history || scanData.history.length === 0) {
      const mockHistory = generateMockHistory(scanData.dailyTarget, scanData.achieved);
      
      // Update the document with mock history
      await Scan.findByIdAndUpdate(scanData._id, { 
        $set: { history: mockHistory } 
      });
      
      scanData.history = mockHistory;
    }

    // Ensure history has current day's data
    const currentDay = getCurrentDayName();
    const todayEntry = scanData.history.find(entry => entry.day === currentDay);
    
    if (todayEntry) {
      todayEntry.achieved = scanData.achieved;
      todayEntry.target = scanData.dailyTarget;
    }

    res.json({ data: scanData });
  } catch (error) {
    console.error('Error fetching scan data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch scan data';
    res.status(500).json({ error: errorMessage });
  }
};

// New endpoint to update scan data with history
export const updateScanData = async (
  req: Request,
  res: Response<ScanResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      totalScans,
      normalScans,
      abnormalScans,
      pendingValidation,
      dailyTarget,
      achieved,
      history
    } = req.body;

    const currentDay = getCurrentDayName();
    
    // Find existing data or create new
    let scanData = await Scan.findOne().sort({ timestamp: -1 });
    
    if (scanData) {
      // Update existing data
      scanData.totalScans = totalScans || scanData.totalScans;
      scanData.normalScans = normalScans || scanData.normalScans;
      scanData.abnormalScans = abnormalScans || scanData.abnormalScans;
      scanData.pendingValidation = pendingValidation || scanData.pendingValidation;
      scanData.dailyTarget = dailyTarget || scanData.dailyTarget;
      scanData.achieved = achieved || scanData.achieved;
      scanData.timestamp = new Date();
      
      // Update history if provided, otherwise generate mock data
      if (history && Array.isArray(history)) {
        scanData.history = history;
      } else if (!scanData.history || scanData.history.length === 0) {
        scanData.history = generateMockHistory(scanData.dailyTarget, scanData.achieved);
      }
      
      // Update today's entry in history
      const todayEntryIndex = scanData.history.findIndex(entry => entry.day === currentDay);
      if (todayEntryIndex !== -1) {
        scanData.history[todayEntryIndex].achieved = scanData.achieved;
        scanData.history[todayEntryIndex].target = scanData.dailyTarget;
      }
      
      await scanData.save();
    } else {
      // Create new data
      const newHistory = history && Array.isArray(history) 
        ? history 
        : generateMockHistory(dailyTarget || 5000, achieved || 0);
      
      scanData = new Scan({
        totalScans: totalScans || 0,
        normalScans: normalScans || 0,
        abnormalScans: abnormalScans || 0,
        pendingValidation: pendingValidation || 0,
        dailyTarget: dailyTarget || 5000,
        achieved: achieved || 0,
        history: newHistory,
        timestamp: new Date()
      });
      
      await scanData.save();
    }

    res.json({ 
      message: 'Scan data updated successfully',
      data: scanData
    });
  } catch (error) {
    console.error('Error updating scan data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update scan data';
    res.status(500).json({ error: errorMessage });
  }
};