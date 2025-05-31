import { useState, useEffect, useCallback, useRef } from 'react';
import { MapDataService } from '../services/MapDataService';

export const useRealtimeMap = (disease: string, timeRange: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  
  const dataService = useRef(MapDataService.getInstance());
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const initialData = await dataService.current.fetchDistrictData(disease, timeRange);
      setData(initialData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [disease, timeRange]);

  const handleRealtimeUpdate = useCallback((updates: any) => {
    if (Array.isArray(updates)) {
      // Handle bulk updates
      setData(prevData => {
        const newData = [...prevData];
        updates.forEach((update: any) => {
          if (update.type === 'alert') {
            setAlerts(prev => [...prev, update.data]);
          } else {
            // Update district data
            const index = newData.findIndex(d => d.id === update.districtId);
            if (index >= 0) {
              newData[index] = { ...newData[index], ...update };
            }
          }
        });
        return newData;
      });
    }
  }, []);

  // Initialize real-time connection
  useEffect(() => {
    setConnectionStatus('connecting');
    
    // Subscribe to real-time updates
    unsubscribeRef.current = dataService.current.subscribe(handleRealtimeUpdate);
    
    // Connect WebSocket (if available)
    if (process.env.NODE_ENV === 'production') {
      const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';
      dataService.current.connectWebSocket(wsUrl);
    }
    
    setConnectionStatus('connected');
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [handleRealtimeUpdate]);

  // Load initial data when dependencies change
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const addAlertRule = useCallback((rule: any) => {
    dataService.current.addAlertRule(rule);
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  const exportData = useCallback(async (format: 'json' | 'csv' | 'excel') => {
    try {
      const blob = await dataService.current.exportData(format, { disease, timeRange });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `telangana-health-data-${Date.now()}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [disease, timeRange]);

  return {
    data,
    isLoading,
    error,
    alerts,
    connectionStatus,
    addAlertRule,
    acknowledgeAlert,
    exportData,
    refresh: loadInitialData,
  };
};
