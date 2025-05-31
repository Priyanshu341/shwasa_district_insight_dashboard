import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, Clock, Database, RefreshCw } from 'lucide-react';
import { fetchAlertsData } from '@/services/dashboardService';

interface Alert {
  id: string;
  title: string;
  facility: string;
  time: string;
  icon: 'Database' | 'AlertTriangle' | 'Bell';
  type: 'critical' | 'warning' | 'info';
  description?: string;
}

const AlertsFeed = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getIconComponent = (iconName: Alert['icon']) => {
    const iconMap = {
      Database,
      AlertTriangle,
      Bell
    };
    return iconMap[iconName] || Bell;
  };

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAlertsData();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAlerts = async () => {
    setIsRefreshing(true);
    await loadAlerts();
    setIsRefreshing(false);
  };

  const handleAlertClick = (alert: Alert) => {
    console.log(`Alert clicked: ${alert.title} - ${alert.description || `Alert from ${alert.facility}`}`);
  };

  const criticalCount = alerts.filter((a) => a.type === 'critical').length;

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <Card className="dashboard-card col-span-6 md:col-span-4 h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Real-Time Alerts</CardTitle>
          <Badge
            variant="destructive"
            className={`${criticalCount > 0 ? 'animate-pulse' : ''}`}
          >
            {criticalCount} Critical
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="border rounded-md p-3 animate-pulse bg-gray-200 dark:bg-gray-700 h-20"></div>
            ))
          ) : alerts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No alerts found</div>
          ) : (
            alerts.map((alert) => {
              const AlertIcon = getIconComponent(alert.icon);
              return (
                <div
                  key={alert.id}
                  className={`
                    border rounded-md p-3 transition-all duration-200 cursor-pointer
                    ${alert.type === 'critical'
                      ? 'bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 border-red-200 dark:border-red-800'
                      : alert.type === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 border-amber-200 dark:border-amber-800'
                      : 'bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 border-blue-200 dark:border-blue-800'}
                    hover:scale-[1.02] hover:shadow-md
                  `}
                  onClick={() => handleAlertClick(alert)}
                >
                  <div className="flex items-start gap-3">
                    <AlertIcon
                      className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        alert.type === 'critical' ? 'text-red-600 dark:text-red-400' :
                        alert.type === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {alert.facility}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>{alert.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={refreshAlerts}
            disabled={isLoading || isRefreshing}
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Alerts
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsFeed;
