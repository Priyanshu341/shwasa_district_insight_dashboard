import { Request, Response, NextFunction } from 'express';
import { AIPerformance } from '../models/aiPerformance.model';

interface AIPerformanceResponse {
  message?: string;
  data?: any;
  error?: string;
}

export const getAIPerformance = async (
  req: Request,
  res: Response<AIPerformanceResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { diseaseType = 'all' } = req.query;

    // Validate diseaseType
    if (!['tb', 'copd', 'pneumonia', 'all'].includes(diseaseType as string)) {
      res.status(400).json({ message: 'Invalid disease type' });
      return;
    }

    const performance = await AIPerformance.findOne({ diseaseType })
      .sort({ timestamp: -1 })
      .limit(1)
      .lean();

    if (!performance) {
      res.status(404).json({ message: 'No AI performance data found' });
      return;
    }

    res.json({ data: performance });
  } catch (error) {
    console.error('Error fetching AI performance:', error);
    
    // Differentiate between different error types if needed
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown server error occurred';
      
    res.status(500).json({ error: errorMessage });
  }
};