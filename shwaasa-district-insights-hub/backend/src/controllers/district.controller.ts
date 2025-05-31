
import { Request, Response, NextFunction } from 'express';
import { District } from '../models/district.model';

interface DistrictResponse {
  message?: string;
  data?: any;
  error?: string;
}

// export const getDistricts = async (
//   req: Request,
//   res: Response<DistrictResponse>,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const timeRange = (req.query.timeRange as string) || '7d';
//     const districts = await District.find().sort({ name: 1 }).lean();

//     if (!districts || districts.length === 0) {
//       res.status(404).json({ message: 'No districts found' });
//       return;
//     }

//     const transformedDistricts = districts.map(district => {
//       // Default to base values if no historical data exists
//       let tb = district.tb || 0;
//       let copd = district.copd || 0;
//       let fibrosis = district.fibrosis || 0;
//       let pneumonia = district.pneumonia || 0;

//       // Override with historical data if available
//       if (district.history && Array.isArray(district.history)) {
//         const historicalData = district.history.find(h => h.period === timeRange);
//         if (historicalData) {
//           tb = historicalData.tb || 0;
//           copd = historicalData.copd || 0;
//           fibrosis = historicalData.fibrosis || 0;
//           pneumonia = historicalData.pneumonia || 0;
//         }
//       }

//       const total = tb + copd + fibrosis + pneumonia;
//       let riskLevel: 'high' | 'medium' | 'low' = 'low';
//       if (total > 1000) riskLevel = 'high';
//       else if (total > 500) riskLevel = 'medium';

//       return {
//         id: district.id,
//         name: district.name,
//         total,
//         tb,
//         copd,
//         fibrosis,
//         pneumonia,
//         riskLevel
//       };
//     });

//     res.json({ data: transformedDistricts });
//   } catch (error) {
//     console.error('Error fetching districts:', error);
//     const errorMessage = error instanceof Error ? error.message : 'Failed to fetch districts';
//     res.status(500).json({ error: errorMessage });
//   }
// };
export const getDistricts = async (
  req: Request,
  res: Response<DistrictResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const timeRange = (req.query.timeRange as string) || '7d';
    const districts = await District.find().sort({ name: 1 }).lean();

    if (!districts || districts.length === 0) {
      res.status(404).json({ message: 'No districts found' });
      return;
    }

    const transformedDistricts = districts.map(district => {
      // Default to base values if no historical data exists
      let tb = district.tb || 0;
      let copd = district.copd || 0;
      let fibrosis = district.fibrosis || 0;
      let pneumonia = district.pneumonia || 0;

      // Handle historical data based on the time range
      if (district.history && Array.isArray(district.history)) {
        let targetPeriod = timeRange;

        // If the timeRange is a custom day value (e.g., "30d", "45d"), find the closest 5-day interval
        if (!['7d', '15d', '30d', '90d'].includes(timeRange)) {
          const days = parseInt(timeRange.replace('d', ''), 10) || 7;
          // Find the nearest 5-day interval (e.g., for 47d, use 45d; for 13d, use 15d)
          const closestInterval = Math.round(days / 5) * 5;
          targetPeriod = `${closestInterval}d`;
        }

        const historicalData = district.history.find(h => h.period === targetPeriod);
        if (historicalData) {
          tb = historicalData.tb || 0;
          copd = historicalData.copd || 0;
          fibrosis = historicalData.fibrosis || 0;
          pneumonia = historicalData.pneumonia || 0;
        }
      }

      const total = tb + copd + fibrosis + pneumonia;
      let riskLevel: 'high' | 'medium' | 'low' = 'low';
      if (total > 1000) riskLevel = 'high';
      else if (total > 500) riskLevel = 'medium';

      return {
        id: district.id,
        name: district.name,
        total,
        tb,
        copd,
        fibrosis,
        pneumonia,
        riskLevel
      };
    });

  const totalCases = transformedDistricts.reduce((sum, district) => sum + district.total, 0);
    console.log(`Total cases for time range ${timeRange}: ${totalCases}`);

    res.json({ data: transformedDistricts });
  } catch (error) {
    console.error('Error fetching districts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch districts';
    res.status(500).json({ error: errorMessage });
  }
};
export const getDistrictById = async (
  req: Request,
  res: Response<DistrictResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const timeRange = (req.query.timeRange as string) || '7d';
    const district = await District.findOne({ id: req.params.id }).lean();

    if (!district) {
      res.status(404).json({ message: 'District not found' });
      return;
    }

    let tb = district.tb || 0;
    let copd = district.copd || 0;
    let fibrosis = district.fibrosis || 0;
    let pneumonia = district.pneumonia || 0;

    if (district.history && Array.isArray(district.history)) {
      const historicalData = district.history.find(h => h.period === timeRange);
      if (historicalData) {
        tb = historicalData.tb || 0;
        copd = historicalData.copd || 0;
        fibrosis = historicalData.fibrosis || 0;
        pneumonia = historicalData.pneumonia || 0;
      }
    }

    const total = tb + copd + fibrosis + pneumonia;
    let riskLevel: 'high' | 'medium' | 'low' = 'low';
    if (total > 1000) riskLevel = 'high';
    else if (total > 500) riskLevel = 'medium';

    const transformedDistrict = {
      id: district.id,
      name: district.name,
      total,
      tb,
      copd,
      fibrosis,
      pneumonia,
      riskLevel
    };

    res.json({ data: transformedDistrict });
  } catch (error) {
    console.error('Error fetching district:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch district';
    res.status(500).json({ error: errorMessage });
  }
};

export const getDistrictsByDisease = async (
  req: Request,
  res: Response<DistrictResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { disease } = req.params;
    const timeRange = (req.query.timeRange as string) || '7d';
    const validDiseases = ['tb', 'copd', 'fibrosis', 'pneumonia', 'all'];

    if (!validDiseases.includes(disease)) {
      res.status(400).json({ error: 'Invalid disease parameter' });
      return;
    }

    const districts = await District.find().sort({ name: 1 }).lean();

    if (!districts || districts.length === 0) {
      res.status(404).json({ message: 'No districts found' });
      return;
    }

    const transformedDistricts = districts.map(district => {
      let tb = district.tb || 0;
      let copd = district.copd || 0;
      let fibrosis = district.fibrosis || 0;
      let pneumonia = district.pneumonia || 0;

      if (district.history && Array.isArray(district.history)) {
        const historicalData = district.history.find(h => h.period === timeRange);
        if (historicalData) {
          tb = historicalData.tb || 0;
          copd = historicalData.copd || 0;
          fibrosis = historicalData.fibrosis || 0;
          pneumonia = historicalData.pneumonia || 0;
        }
      }

      const total = tb + copd + fibrosis + pneumonia;
      let riskLevel: 'high' | 'medium' | 'low' = 'low';
      if (total > 1000) riskLevel = 'high';
      else if (total > 500) riskLevel = 'medium';

      return {
        id: district.id,
        name: district.name,
        total,
        tb,
        copd,
        fibrosis,
        pneumonia,
        riskLevel
      };
    });

    res.json({ data: transformedDistricts });
  } catch (error) {
    console.error('Error fetching districts by disease:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch districts';
    res.status(500).json({ error: errorMessage });
  }
};