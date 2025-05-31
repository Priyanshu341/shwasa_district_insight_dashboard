import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface DistrictData {
  id: string;
  name: string;
  total: number;
  tb: number;
  copd: number;
  pneumonia: number;
  fibrosis: number;
  riskLevel: 'low' | 'medium' | 'high';
  population?: number;
  area?: number;
  coordinates?: { lat: number; lng: number };
}

export interface RiskZone {
  id: string;
  name: string;
  description: string;
  status: 'alert' | 'escalating' | 'stable';
  recommendation: string;
  coordinates: { x: number; y: number };
  priority: number;
  lastUpdated: string;
}

export const useMapData = (disease: string, timeRange: string) => {
  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ['mapData', disease, timeRange],
    queryFn: async () => {
      // Replace with your actual API call
      const response = await fetch(`/api/districts?disease=${disease}&timeRange=${timeRange}`);
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const processedData = useMemo(() => {
    if (!rawData) return [];
    
    return rawData.map((district: any) => ({
      ...district,
      density: district.total / (district.population || 1) * 100000, // per 100k population
      trend: calculateTrend(district.historical || []),
    }));
  }, [rawData]);

  return { data: processedData, isLoading, error };
};

const calculateTrend = (historical: number[]) => {
  if (historical.length < 2) return 0;
  const recent = historical.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const previous = historical.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
  return ((recent - previous) / previous) * 100;
};