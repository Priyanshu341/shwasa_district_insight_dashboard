// import React from 'react';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { useQuery } from '@tanstack/react-query';
// import { fetchScanData } from '@/services/dashboardService';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const ScanVolumeCard = () => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['scanData'],
//     queryFn: fetchScanData,
//     refetchInterval: 30000, // Refresh every 30 seconds
//   });

//   // Use chart data from API if available, otherwise empty array
//   const chartData = React.useMemo(() => {
//     if (data?.history && Array.isArray(data.history)) {
//       return data.history;
//     }
//     return [];
//   }, [data]);

//   // Format using Indian numbering (thousands separator)
//   const formatNumber = (num: number) => num.toLocaleString('en-IN');

//   const dailyTarget = data?.dailyTarget || 5000;
//   const achieved = data?.achieved || 0;
//   const progressPercentage = (achieved / dailyTarget) * 100;

//   return (
//     <Card className="dashboard-card h-full overflow-hidden">
//       <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
//         <CardTitle className="text-lg font-medium">Scan Volume & AI Summary</CardTitle>
//       </CardHeader>
//       <CardContent className="pb-2">
//         {isLoading ? (
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-pulse">
//             {[1, 2, 3, 4].map(i => (
//               <div key={i} className="h-20 rounded-lg bg-muted/80"></div>
//             ))}
//           </div>
//         ) : error ? (
//           <div className="text-destructive">Error loading scan data</div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//             <div className="stat-card bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
//               <p className="stat-value">{formatNumber(data?.totalScans || 0)}</p>
//               <p className="stat-label">Total scans</p>
//             </div>
//             <div className="stat-card bg-gradient-to-br from-green-100/80 to-green-50/50 rounded-lg dark:from-green-950/30 dark:to-green-900/20">
//               <p className="stat-value text-green-600 dark:text-green-400">{formatNumber(data?.normalScans || 0)}</p>
//               <p className="stat-label">Normal scans</p>
//             </div>
//             <div className="stat-card bg-gradient-to-br from-red-100/80 to-red-50/50 rounded-lg dark:from-red-950/30 dark:to-red-900/20">
//               <p className="stat-value text-red-600 dark:text-red-400">{formatNumber(data?.abnormalScans || 0)}</p>
//               <p className="stat-label">Abnormal scans</p>
//             </div>
//             <div className="stat-card bg-gradient-to-br from-amber-100/80 to-amber-50/50 rounded-lg dark:from-amber-950/30 dark:to-amber-900/20">
//               <p className="stat-value text-amber-600 dark:text-amber-400">{formatNumber(data?.pendingValidation || 0)}</p>
//               <p className="stat-label">Pending validation</p>
//             </div>
//           </div>
//         )}

//         <h4 className="font-medium mb-2">Daily Scan Target vs Achieved</h4>
//         <div className="space-y-1">
//           <div className="flex items-center justify-between">
//             <p className="text-sm">Today's progress</p>
//             <p className="text-sm font-medium">
//               {isLoading ?
//                 <span className="inline-block w-16 h-4 bg-muted animate-pulse rounded"></span> :
//                 `${formatNumber(achieved)} / ${formatNumber(dailyTarget)}`}
//             </p>
//           </div>
//           <Progress
//             value={isLoading ? 30 : progressPercentage}
//             className={`h-2 bg-muted/50 ${isLoading ? 'animate-pulse' : ''}`}
//           />
//         </div>

//         <div className="mt-6 h-[240px] rounded-lg border border-border/50 overflow-hidden">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={chartData}
//               margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
//               <XAxis dataKey="day" />
//               <YAxis />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: 'rgba(255, 255, 255, 0.8)',
//                   borderRadius: '0.5rem',
//                   border: '1px solid var(--border)',
//                   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
//                 }}
//               />
//               <Bar
//                 name="Target"
//                 dataKey="target"
//                 fill="var(--muted)"
//                 radius={[4, 4, 0, 0]}
//               />
//               <Bar
//                 name="Achieved"
//                 dataKey="achieved"
//                 fill="hsl(var(--primary))"
//                 radius={[4, 4, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//       <CardFooter className="text-xs text-muted-foreground bg-muted/20">
//         Last updated: {new Date().toLocaleString('en-US', {
//           hour: 'numeric',
//           minute: 'numeric',
//           hour12: true
//         })}
//       </CardFooter>
//     </Card>
//   );
// };

// export default ScanVolumeCard;
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { fetchScanData } from '@/services/dashboardService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ScanVolumeCard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['scanData'],
    queryFn: fetchScanData,
    refetchInterval: 30000,
  });

  const chartData = React.useMemo(() => {
    if (data?.history && Array.isArray(data.history)) {
      return data.history;
    }
    return [];
  }, [data]);

  const formatNumber = (num: number) => num.toLocaleString('en-IN');
  const dailyTarget = data?.dailyTarget || 5000;
  const achieved = data?.achieved || 0;
  const progressPercentage = Math.min((achieved / dailyTarget) * 100, 100);

  return (
    <Card className="dashboard-card h-full overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="text-lg font-medium">Scan Volume & AI Summary</CardTitle>
      </CardHeader>

      <CardContent className="pb-2">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 rounded-lg bg-muted/80"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive">Error loading scan data</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="stat-card bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <p className="stat-value">{formatNumber(data?.totalScans || 0)}</p>
              <p className="stat-label">Total scans</p>
            </div>
            <div className="stat-card bg-gradient-to-br from-green-100/80 to-green-50/50 rounded-lg dark:from-green-950/30 dark:to-green-900/20">
              <p className="stat-value text-green-600 dark:text-green-400">{formatNumber(data?.normalScans || 0)}</p>
              <p className="stat-label">Normal scans</p>
            </div>
            <div className="stat-card bg-gradient-to-br from-red-100/80 to-red-50/50 rounded-lg dark:from-red-950/30 dark:to-red-900/20">
              <p className="stat-value text-red-600 dark:text-red-400">{formatNumber(data?.abnormalScans || 0)}</p>
              <p className="stat-label">Abnormal scans</p>
            </div>
            <div className="stat-card bg-gradient-to-br from-amber-100/80 to-amber-50/50 rounded-lg dark:from-amber-950/30 dark:to-amber-900/20">
              <p className="stat-value text-amber-600 dark:text-amber-400">{formatNumber(data?.pendingValidation || 0)}</p>
              <p className="stat-label">Pending validation</p>
            </div>
          </div>
        )}

        <h4 className="font-medium mb-2">Daily Scan Target vs Achieved</h4>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm">Today's progress</p>
            <p className="text-sm font-medium">
              {isLoading ? (
                <span className="inline-block w-16 h-4 bg-muted animate-pulse rounded" />
              ) : (
                `${formatNumber(achieved)} / ${formatNumber(dailyTarget)}`
              )}
            </p>
          </div>
          <Progress
            value={isLoading ? 30 : progressPercentage}
            className={`h-2 bg-muted/50 ${isLoading ? 'animate-pulse' : ''}`}
          />
        </div>

        <div className="mt-6 h-[240px] rounded-lg border border-border/50 overflow-hidden">
          {isLoading ? (
            <div className="h-full w-full bg-muted/20 animate-pulse rounded"></div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '0.85rem',
                  }}
                />
                <Bar
                  name="Target"
                  dataKey="target"
                  fill="var(--muted)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  name="Achieved"
                  dataKey="achieved"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-center text-muted-foreground py-12">
              No historical data available
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground bg-muted/20">
        Last updated:{' '}
        {new Date().toLocaleString('en-IN', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })}
      </CardFooter>
    </Card>
  );
};

export default ScanVolumeCard;
