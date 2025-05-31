import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  Download, 
  RefreshCw, 
  Settings, 
  Wifi, 
  WifiOff, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useRealtimeMap } from '../hooks/UseRealtimeMap';
import { ConfigurableMap } from './ConfigurableMap';

export const RealtimeMapDashboard: React.FC = () => {
  const [activeDisease, setActiveDisease] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [showAlerts, setShowAlerts] = useState(false);

  const {
    data,
    isLoading,
    error,
    alerts,
    connectionStatus,
    addAlertRule,
    acknowledgeAlert,
    exportData,
    refresh,
  } = useRealtimeMap(activeDisease, timeRange);

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  const handleAddAlertRule = useCallback(() => {
    const rule = {
      id: `rule-${Date.now()}`,
      name: `High ${activeDisease.toUpperCase()} Alert`,
      condition: 'cases > 50',
      districts: ['all'],
      diseases: [activeDisease],
      enabled: true,
      priority: 'high' as const,
      actions: ['notification', 'email'],
    };
    
    addAlertRule(rule);
  }, [activeDisease, addAlertRule]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {/* Failed to load map data: {error} */}
          Failed to load map data:{error}
          <Button variant="outline" size="sm" onClick={refresh} className="ml-2">
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Real-time Health Map Dashboard
                <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
                  {connectionStatus === 'connected' ? (
                    <><Wifi className="h-3 w-3 mr-1" /> Live</>
                  ) : (
                    <><WifiOff className="h-3 w-3 mr-1" /> Offline </>
                  )}
                </Badge>
              </CardTitle>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={unacknowledgedAlerts.length > 0 ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setShowAlerts(!showAlerts)}
              >
                <Bell className="h-4 w-4 mr-1" />
                Alerts ({unacknowledgedAlerts.length})
              </Button>
              
              <Select onValueChange={exportData}>
                <SelectTrigger className="w-24">
                  <Download className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon" onClick={refresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          {/* Disease and time range selectors */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Disease:</label>
              <Select value={activeDisease} onValueChange={setActiveDisease}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="tb">TB</SelectItem>
                  <SelectItem value="copd">COPD</SelectItem>
                  <SelectItem value="pneumonia">Pneumonia</SelectItem>
                  <SelectItem value="fibrosis">Fibrosis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Time Range:</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last Day</SelectItem>
                  <SelectItem value="7d">Last Week</SelectItem>
                  <SelectItem value="30d">Last Month</SelectItem>
                  <SelectItem value="90d">Last Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleAddAlertRule}>
              <Settings className="h-4 w-4 mr-1" />
              Add Alert Rule
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Alerts Panel */}
      {showAlerts && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              {alerts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No active alerts</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-md border ${
                        alert.acknowledged 
                          ? 'bg-muted/50 border-muted' 
                          : alert.priority === 'high' 
                            ? 'bg-red-50 border-red-200 dark:bg-red-950/30' 
                            : 'bg-amber-50 border-amber-200 dark:bg-amber-950/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{alert.ruleName}</h4>
                          <p className="text-xs text-muted-foreground">
                            {alert.value} cases in {alert.districtId}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                            <Badge 
                              variant={alert.priority === 'high' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {alert.priority}
                            </Badge>
                          </div>
                        </div>
                        
                        {!alert.acknowledged && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Main Map */}
      <ConfigurableMap
        data={data}
        activeField={activeDisease}
        onConfigChange={(config) => {
          // Handle configuration changes
          console.log('Map configuration updated:', config);
        }}
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">Districts Monitored</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {data.reduce((sum, d) => sum + (d[activeDisease] || d.total || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total Cases</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-500">
              {data.filter(d => d.riskLevel === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">High Risk Districts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-500">
              {unacknowledgedAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">Pending Alerts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};