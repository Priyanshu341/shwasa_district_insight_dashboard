import { Request, Response, NextFunction } from 'express';
import { Alert } from '../models/alert.model';

interface AlertResponse {
  message?: string;
  data?: any;
  error?: string;
}

export const getAlerts = async (
  req: Request,
  res: Response<AlertResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.query;
    const query: Record<string, any> = { resolved: false };
    
    if (type) {
      if (!['critical', 'warning', 'info'].includes(type as string)) {
        res.status(400).json({ message: 'Invalid alert type' });
        return;
      }
      query.type = type;
    }
    
    const alerts = await Alert.find(query).sort({ time: -1 }).lean();
    
    if (!alerts || alerts.length === 0) {
      res.status(404).json({ message: 'No alerts found' });
      return;
    }

    res.json({ data: alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch alerts';
    res.status(500).json({ error: errorMessage });
  }
};

export const markAlertAsResolved = async (
  req: Request,
  res: Response<AlertResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { id: req.params.id },
      { resolved: true },
      { new: true }
    ).lean();
    
    if (!alert) {
      res.status(404).json({ message: 'Alert not found' });
      return;
    }
    
    res.json({ data: alert, message: 'Alert marked as resolved' });
  } catch (error) {
    console.error('Error resolving alert:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to resolve alert';
    res.status(500).json({ error: errorMessage });
  }
};