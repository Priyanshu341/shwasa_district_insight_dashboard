import { Request, Response, NextFunction } from 'express';
import { Facility } from '../models/facility.model';

interface FacilityResponse {
  message?: string;
  data?: any;
  error?: string;
}

export const getFacilities = async (
  req: Request,
  res: Response<FacilityResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { sortBy = 'scans', order = 'desc' } = req.query;
    
    // Validate sort parameters
    const validSortFields = ['scans', 'accuracy', 'name'];
    if (!validSortFields.includes(sortBy as string)) {
      res.status(400).json({ message: 'Invalid sort field' });
      return;
    }

    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy as string] = order === 'asc' ? 1 : -1;
    
    const facilities = await Facility.find().sort(sortOptions).lean();
    
    if (!facilities || facilities.length === 0) {
      res.status(404).json({ message: 'No facilities found' });
      return;
    }

    res.json({ data: facilities });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch facilities';
    res.status(500).json({ error: errorMessage });
  }
};

export const getFacilityById = async (
  req: Request,
  res: Response<FacilityResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const facility = await Facility.findOne({ id: req.params.id }).lean();
    
    if (!facility) {
      res.status(404).json({ message: 'Facility not found' });
      return;
    }

    res.json({ data: facility });
  } catch (error) {
    console.error('Error fetching facility:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch facility';
    res.status(500).json({ error: errorMessage });
  }
};