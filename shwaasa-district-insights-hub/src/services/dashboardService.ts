// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.shwaasa-insights.com/api';
// const DEV_API_URL = import.meta.env.VITE_DEV_API_URL || 'http://localhost:5000/api';
// const isProduction = import.meta.env.PROD;
// const CURRENT_API_URL = isProduction ? API_BASE_URL : DEV_API_URL;

// async function fetchFromAPI<T>(endpoint: string): Promise<T> {
//   const fullUrl = `${CURRENT_API_URL}/${endpoint}`;
//   console.log(`[API] Requesting: ${fullUrl}`);
  
//   const response = await fetch(fullUrl);
  
//   if (!response.ok) {
//     throw new Error(`[API ERROR] ${response.status} - ${response.statusText}`);
//   }
  
//   return await response.json() as T;
// }

// // --- Types ---
// export interface HistoryEntry {
//   day: string;
//   target: number;
//   achieved: number;
//   date?: string;
// }

// export interface ScanData {
//   totalScans: number;
//   normalScans: number;
//   abnormalScans: number;
//   pendingValidation: number;
//   dailyTarget: number;
//   achieved: number;
//   history: HistoryEntry[];
//   timestamp?: string;
// }

// export interface FacilityData {
//   id: string;
//   name: string;
//   district: string;
//   scans: number;
//   accuracy: number;
//   status: 'Green' | 'Yellow' | 'Red';
//   state?: string;
// }

// export interface SmartStopData {
//   minutesSaved: number;
//   radiationAvoided: number;
//   powerSaved: number;
//   costSaved: number;
//   co2Offset: number;
// }

// export interface AlertData {
//   id: string;
//   type: 'critical' | 'warning' | 'info';
//   title: string;
//   facility: string;
//   time: string;
//   icon: 'Database' | 'AlertTriangle' | 'Bell';
//   description?: string;
// }

// export interface AiPerformanceData {
//   precision: number;
//   change: number;
//   confidenceDistribution: {
//     high: number;
//     medium: number;
//     low: number;
//   };
//   responseTime: {
//     average: number;
//     peak: number;
//     lowest: number;
//     targetMet: boolean;
//   };
// }

// export interface DistrictData {
//   id: string;
//   name: string;
//   total: number;
//   tb: number;
//   copd: number;
//   pneumonia: number;
//   fibrosis: number;
//   riskLevel: 'high' | 'medium' | 'low';
// }

// // --- API Functions ---
// export const fetchScanData = async (): Promise<ScanData> => {
//   try {
//     const response = await fetchFromAPI<{ data: ScanData }>('scans');
//     console.log('[API] Scan data received:', response.data);
    
//     // Ensure history exists, create fallback if needed
//     if (!response.data.history || !Array.isArray(response.data.history) || response.data.history.length === 0) {
//       console.warn('[API] No history data found, creating fallback');
      
//       const fallbackHistory: HistoryEntry[] = [
//         { day: 'Mon', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
//         { day: 'Tue', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
//         { day: 'Wed', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
//         { day: 'Thu', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
//         { day: 'Fri', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
//         { day: 'Sat', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
//         { day: 'Sun', target: response.data.dailyTarget || 5000, achieved: response.data.achieved || 0 }
//       ];
      
//       response.data.history = fallbackHistory;
//     }
    
//     return response.data;
//   } catch (error) {
//     console.error('[API] Error fetching scan data:', error);
//     throw error;
//   }
// };

// export const updateScanData = async (scanData: Partial<ScanData>): Promise<ScanData> => {
//   try {
//     const response = await fetch(`${CURRENT_API_URL}/scans`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(scanData),
//     });

//     if (!response.ok) {
//       throw new Error(`[API ERROR] ${response.status} - ${response.statusText}`);
//     }

//     const result = await response.json();
//     return result.data;
//   } catch (error) {
//     console.error('[API] Error updating scan data:', error);
//     throw error;
//   }
// };

// export const fetchFacilityData = async (): Promise<FacilityData[]> => {
//   const response = await fetchFromAPI<{ data: FacilityData[] }>('facilities');
//   return response.data;
// };

// export const fetchSmartStopData = async (): Promise<SmartStopData> => {
//   const response = await fetchFromAPI<{ data: SmartStopData }>('smart-stop');
//   return response.data;
// };

// export const fetchAlertsData = async (): Promise<AlertData[]> => {
//   const response = await fetchFromAPI<{ data: AlertData[] }>('alerts');
//   return Array.isArray(response.data) ? response.data : [];
// };

// export const fetchAiPerformanceData = async (): Promise<AiPerformanceData> => {
//   const response = await fetchFromAPI<{ data: AiPerformanceData }>('ai-performance');
//   const data = response.data;
  
//   return {
//     ...data,
//     precision: typeof data.precision === 'string' ? parseFloat(data.precision) : data.precision,
//     change: typeof data.change === 'string' ? parseFloat(data.change) : data.change,
//   };
// };

// export const fetchDistrictData = async (disease: string = 'all'): Promise<DistrictData[]> => {
//   const path = `districts${disease !== 'all' ? '/' + disease : ''}`;
//   const response = await fetchFromAPI<{ data: DistrictData[] }>(path);
//   return Array.isArray(response.data) ? response.data : [];
// };
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.shwaasa-insights.com/api';
// const DEV_API_URL = import.meta.env.VITE_DEV_API_URL || 'http://localhost:5000/api';
// const isProduction = import.meta.env.PROD;
// const CURRENT_API_URL = isProduction ? API_BASE_URL : DEV_API_URL;

// async function fetchFromAPI<T>(endpoint: string): Promise<T> {
//   const fullUrl = `${CURRENT_API_URL}/${endpoint}`;
//   console.log(`[API] Requesting: ${fullUrl}`);
  
//   const response = await fetch(fullUrl);
  
//   if (!response.ok) {
//     throw new Error(`[API ERROR] ${response.status} - ${response.statusText}`);
//   }
  
//   return await response.json() as T;
// }

// // --- Types ---
// export interface HistoryEntry {
//   day: string;
//   target: number;
//   achieved: number;
//   date?: string;
// }

// export interface ScanData {
//   totalScans: number;
//   normalScans: number;
//   abnormalScans: number;
//   pendingValidation: number;
//   dailyTarget: number;
//   achieved: number;
//   history: HistoryEntry[];
//   timestamp?: string;
// }

// export interface FacilityData {
//   id: string;
//   name: string;
//   district: string;
//   scans: number;
//   accuracy: number;
//   status: 'Green' | 'Yellow' | 'Red';
//   state?: string;
// }

// export interface SmartStopData {
//   minutesSaved: number;
//   radiationAvoided: number;
//   powerSaved: number;
//   costSaved: number;
//   co2Offset: number;
// }

// export interface AlertData {
//   id: string;
//   type: 'critical' | 'warning' | 'info';
//   title: string;
//   facility: string;
//   time: string;
//   icon: 'Database' | 'AlertTriangle' | 'Bell';
//   description?: string;
// }

// export interface AiPerformanceData {
//   precision: number;
//   change: number;
//   confidenceDistribution: {
//     high: number;
//     medium: number;
//     low: number;
//   };
//   responseTime: {
//     average: number;
//     peak: number;
//     lowest: number;
//     targetMet: boolean;
//   };
// }

// export interface DistrictData {
//   id: string;
//   name: string;
//   total: number;
//   tb: number;
//   copd: number;
//   pneumonia: number;
//   fibrosis: number;
//   riskLevel: 'high' | 'medium' | 'low';
// }

// // --- API Functions ---
// export const fetchScanData = async (): Promise<ScanData> => {
//   try {
//     const response = await fetchFromAPI<{ data: ScanData }>('scans');
//     console.log('[API] Scan data received:', response.data);
    
//     // Ensure history exists, create fallback if needed
//     if (!response.data.history || !Array.isArray(response.data.history) || response.data.history.length === 0) {
//       console.warn('[API] No history data found, creating fallback');
      
//       const fallbackHistory: HistoryEntry[] = [
//         { day: 'Mon', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
//         { day: 'Tue', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
//         { day: 'Wed', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
//         { day: 'Thu', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
//         { day: 'Fri', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
//         { day: 'Sat', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
//         { day: 'Sun', target: response.data.dailyTarget || 5000, achieved: response.data.achieved || 0 }
//       ];
      
//       response.data.history = fallbackHistory;
//     }
    
//     return response.data;
//   } catch (error) {
//     console.error('[API] Error fetching scan data:', error);
//     throw error;
//   }
// };

// export const updateScanData = async (scanData: Partial<ScanData>): Promise<ScanData> => {
//   try {
//     const response = await fetch(`${CURRENT_API_URL}/scans`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(scanData),
//     });

//     if (!response.ok) {
//       throw new Error(`[API ERROR] ${response.status} - ${response.statusText}`);
//     }

//     const result = await response.json();
//     return result.data;
//   } catch (error) {
//     console.error('[API] Error updating scan data:', error);
//     throw error;
//   }
// };

// export const fetchFacilityData = async (): Promise<FacilityData[]> => {
//   const response = await fetchFromAPI<{ data: FacilityData[] }>('facilities');
//   return response.data;
// };

// export const fetchSmartStopData = async (): Promise<SmartStopData> => {
//   const response = await fetchFromAPI<{ data: SmartStopData }>('smart-stop');
//   return response.data;
// };

// export const fetchAlertsData = async (): Promise<AlertData[]> => {
//   const response = await fetchFromAPI<{ data: AlertData[] }>('alerts');
//   return Array.isArray(response.data) ? response.data : [];
// };

// export const fetchAiPerformanceData = async (): Promise<AiPerformanceData> => {
//   const response = await fetchFromAPI<{ data: AiPerformanceData }>('ai-performance');
//   const data = response.data;
  
//   return {
//     ...data,
//     precision: typeof data.precision === 'string' ? parseFloat(data.precision) : data.precision,
//     change: typeof data.change === 'string' ? parseFloat(data.change) : data.change,
//   };
// };

// // FIXED: Updated to match your backend route structure
// export const fetchDistrictData = async (disease: string = 'all'): Promise<DistrictData[]> => {
//   try {
//     // Match your backend routes exactly:
//     // router.get('/', getDistricts); - for all districts
//     // router.get('/disease/:disease', getDistrictsByDisease); - for disease filtering
//     // router.get('/:id', getDistrictById); - for specific district
    
//     const endpoint = disease === 'all' ? 'districts' : `districts/disease/${disease}`;
//     console.log(`[API] Fetching district data for: ${disease}, endpoint: ${endpoint}`);
    
//     const response = await fetchFromAPI<{ data: DistrictData[] }>(endpoint);
    
//     // Ensure we always return an array
//     if (!response.data || !Array.isArray(response.data)) {
//       console.warn('[API] Invalid district data received, returning empty array');
//       return [];
//     }
    
//     console.log(`[API] Successfully fetched ${response.data.length} districts for ${disease}`);
//     return response.data;
    
//   } catch (error) {
//     console.error(`[API] Error fetching district data for ${disease}:`, error);
//     // Return empty array on error to prevent frontend crashes
//     return [];
//   }
// };

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.shwaasa-insights.com/api';
const DEV_API_URL = import.meta.env.VITE_DEV_API_URL || 'http://localhost:5000/api';
const isProduction = import.meta.env.PROD;
const CURRENT_API_URL = isProduction ? API_BASE_URL : DEV_API_URL;

async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const fullUrl = `${CURRENT_API_URL}/${endpoint}`;
  console.log(`[API] Requesting: ${fullUrl}`);

  const response = await fetch(fullUrl);

  if (!response.ok) {
    throw new Error(`[API ERROR] ${response.status} - ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export interface HistoryEntry {
  day: string;
  target: number;
  achieved: number;
  date?: string;
}

export interface ScanData {
  totalScans: number;
  normalScans: number;
  abnormalScans: number;
  pendingValidation: number;
  dailyTarget: number;
  achieved: number;
  history: HistoryEntry[];
  timestamp?: string;
}

export interface FacilityData {
  id: string;
  name: string;
  district: string;
  scans: number;
  accuracy: number;
  status: 'Green' | 'Yellow' | 'Red';
  state?: string;
}

export interface SmartStopData {
  minutesSaved: number;
  radiationAvoided: number;
  powerSaved: number;
  costSaved: number;
  co2Offset: number;
}

export interface AlertData {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  facility: string;
  time: string;
  icon: 'Database' | 'AlertTriangle' | 'Bell';
  description?: string;
}

export interface AiPerformanceData {
  precision: number;
  change: number;
  confidenceDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  responseTime: {
    average: number;
    peak: number;
    lowest: number;
    targetMet: boolean;
  };
}

export interface DistrictData {
  id: string;
  name: string;
  total: number;
  tb: number;
  copd: number;
  pneumonia: number;
  fibrosis: number;
  riskLevel: 'high' | 'medium' | 'low';
}

export const fetchScanData = async (): Promise<ScanData> => {
  try {
    const response = await fetchFromAPI<{ data: ScanData }>('scans');
    console.log('[API] Scan data received:', response.data);

    if (!response.data.history || !Array.isArray(response.data.history) || response.data.history.length === 0) {
      console.warn('[API] No history data found, creating fallback');

      const fallbackHistory: HistoryEntry[] = [
        { day: 'Mon', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
        { day: 'Tue', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
        { day: 'Wed', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
        { day: 'Thu', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
        { day: 'Fri', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
        { day: 'Sat', target: response.data.dailyTarget || 5000, achieved: Math.floor(Math.random() * 6000) },
        { day: 'Sun', target: response.data.dailyTarget || 5000, achieved: response.data.achieved || 0 }
      ];

      response.data.history = fallbackHistory;
    }

    return response.data;
  } catch (error) {
    console.error('[API] Error fetching scan data:', error);
    throw error;
  }
};

export const updateScanData = async (scanData: Partial<ScanData>): Promise<ScanData> => {
  try {
    const response = await fetch(`${CURRENT_API_URL}/scans`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scanData),
    });

    if (!response.ok) {
      throw new Error(`[API ERROR] ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('[API] Error updating scan data:', error);
    throw error;
  }
};

export const fetchFacilityData = async (): Promise<FacilityData[]> => {
  const response = await fetchFromAPI<{ data: FacilityData[] }>('facilities');
  return response.data;
};

export const fetchSmartStopData = async (): Promise<SmartStopData> => {
  const response = await fetchFromAPI<{ data: SmartStopData }>('smart-stop');
  return response.data;
};

export const fetchAlertsData = async (): Promise<AlertData[]> => {
  const response = await fetchFromAPI<{ data: AlertData[] }>('alerts');
  return Array.isArray(response.data) ? response.data : [];
};

export const fetchAiPerformanceData = async (): Promise<AiPerformanceData> => {
  const response = await fetchFromAPI<{ data: AiPerformanceData }>('ai-performance');
  const data = response.data;

  return {
    ...data,
    precision: typeof data.precision === 'string' ? parseFloat(data.precision) : data.precision,
    change: typeof data.change === 'string' ? parseFloat(data.change) : data.change,
  };
};

export const fetchDistrictData = async (disease: string = 'all', timeRange: string = '7d'): Promise<DistrictData[]> => {
  try {
    const endpoint = disease === 'all' ? 'districts' : `districts/disease/${disease}`;
    const query = `timeRange=${timeRange}`;
    const fullEndpoint = `${endpoint}?${query}`;
    console.log(`[API] Fetching district data for: ${disease}, timeRange: ${timeRange}, endpoint: ${fullEndpoint}`);

    const response = await fetchFromAPI<{ data: DistrictData[] }>(fullEndpoint);

    if (!response.data || !Array.isArray(response.data)) {
      console.warn('[API] Invalid district data received, returning empty array');
      return [];
    }

    console.log(`[API] Successfully fetched ${response.data.length} districts for ${disease}`);
    return response.data;
  } catch (error) {
    console.error(`[API] Error fetching district data for ${disease}:`, error);
    return [];
  }
};