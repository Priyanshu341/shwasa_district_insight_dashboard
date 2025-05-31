import { Request, Response, NextFunction } from 'express';
import { SmartStop } from '../models/smartStop.model';

interface SmartStopResponse {
  message?: string;
  data?: any;
  error?: string;
}

export const getSmartStopData = async (
  req: Request,
  res: Response<SmartStopResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const smartStopData = await SmartStop.findOne().sort({ timestamp: -1 }).lean();
    
    if (!smartStopData) {
      res.status(404).json({ message: 'Smart Stop data not found' });
      return;
    }

    res.json({ data: smartStopData });
  } catch (error) {
    console.error('Error fetching Smart Stop data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Smart Stop data';
    res.status(500).json({ error: errorMessage });
  }
};