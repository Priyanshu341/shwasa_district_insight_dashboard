// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { useQuery } from '@tanstack/react-query';
// import { fetchSmartStopData } from '@/services/dashboardService';

// const SmartStopImpactCard = () => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['smartStopData'],
//     queryFn: fetchSmartStopData,
//     refetchInterval: 45000, // Refresh every 45 seconds
//   });

//   return (
//     <Card className="dashboard-card col-span-6 md:col-span-8">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-lg font-medium">Smart Stop Operational Impact</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 animate-pulse">
//             {Array(5).fill(0).map((_, i) => (
//               <div key={i} className="space-y-2">
//                 <div className="h-8 bg-muted/50 rounded-md w-3/4"></div>
//                 <div className="h-5 bg-muted/30 rounded-md w-full"></div>
//                 <div className="h-1 bg-muted/20 rounded-md w-full"></div>
//               </div>
//             ))}
//           </div>
//         ) : error ? (
//           <div className="text-destructive">Error loading impact data</div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
//             <div className="space-y-2">
//               <p className="stat-value">{data?.minutesSaved}</p>
//               <p className="stat-label">Minutes saved per scan</p>
//               <Progress value={Math.min(data.minutesSaved * 10, 100)} className="h-1" />
//             </div>
//             <div className="space-y-2">
//               <p className="stat-value">{data?.radiationAvoided}</p>
//               <p className="stat-label">Radiation avoided (mSv)</p>
//               <Progress value={Math.min(data.radiationAvoided / 20, 100)} className="h-1" />
//             </div>
//             <div className="space-y-2">
//               <p className="stat-value">{data?.powerSaved.toLocaleString()}</p>
//               <p className="stat-label">Power saved (kWh)</p>
//               <Progress value={Math.min(data.powerSaved / 400, 100)} className="h-1" />
//             </div>
//             <div className="space-y-2">
//               <p className="stat-value">₹{data?.costSaved}L</p>
//               <p className="stat-label">Cost saved in rescans</p>
//               <Progress value={Math.min(data.costSaved * 10, 100)} className="h-1" />
//             </div>
//             <div className="space-y-2">
//               <p className="stat-value">{data?.co2Offset}T</p>
//               <p className="stat-label">CO₂ offset (metric tons)</p>
//               <Progress value={Math.min(data.co2Offset * 10, 100)} className="h-1" />
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default SmartStopImpactCard;
// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { useQuery } from '@tanstack/react-query';
// import { fetchSmartStopData } from '@/services/dashboardService';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer
// } from 'recharts';

// const SmartStopImpactCard = () => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['smartStopData'],
//     queryFn: fetchSmartStopData,
//     refetchInterval: 45000,
//   });

//   const mockTrendData = [
//     { month: 'Jan', minutesSaved: 6.1, costSaved: 1.2 },
//     { month: 'Feb', minutesSaved: 6.8, costSaved: 1.5 },
//     { month: 'Mar', minutesSaved: 7.4, costSaved: 1.6 },
//     { month: 'Apr', minutesSaved: 7.9, costSaved: 1.8 },
//     { month: 'May', minutesSaved: 8.2, costSaved: 2.0 },
//     {
//       month: 'Now',
//       minutesSaved: data?.minutesSaved ?? 8.0,
//       costSaved: data?.costSaved ?? 1.9
//     }
//   ];

//   return (
//     <Card className="dashboard-card col-span-6 md:col-span-8">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-lg font-medium">Smart Stop Operational Impact</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 animate-pulse">
//             {Array(5).fill(0).map((_, i) => (
//               <div key={i} className="space-y-2">
//                 <div className="h-8 bg-muted/50 rounded-md w-3/4"></div>
//                 <div className="h-5 bg-muted/30 rounded-md w-full"></div>
//                 <div className="h-1 bg-muted/20 rounded-md w-full"></div>
//               </div>
//             ))}
//           </div>
//         ) : error ? (
//           <div className="text-destructive">Error loading impact data</div>
//         ) : data ? (
//           <>
//             <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
//               <div className="space-y-2">
//                 <p className="stat-value">{data.minutesSaved.toFixed(1)}</p>
//                 <p className="stat-label">Minutes saved per scan</p>
//                 <Progress value={Math.min(data.minutesSaved * 10, 100)} className="h-1" />
//               </div>
//               <div className="space-y-2">
//                 <p className="stat-value">{data.radiationAvoided}</p>
//                 <p className="stat-label">Radiation avoided (mSv)</p>
//                 <Progress value={Math.min(data.radiationAvoided / 20, 100)} className="h-1" />
//               </div>
//               <div className="space-y-2">
//                 <p className="stat-value">{data.powerSaved.toLocaleString()}</p>
//                 <p className="stat-label">Power saved (kWh)</p>
//                 <Progress value={Math.min(data.powerSaved / 400, 100)} className="h-1" />
//               </div>
//               <div className="space-y-2">
//                 <p className="stat-value">₹{data.costSaved.toFixed(1)}L</p>
//                 <p className="stat-label">Cost saved in rescans</p>
//                 <Progress value={Math.min(data.costSaved * 10, 100)} className="h-1" />
//               </div>
//               <div className="space-y-2">
//                 <p className="stat-value">{data.co2Offset.toFixed(1)}T</p>
//                 <p className="stat-label">CO₂ offset (metric tons)</p>
//                 <Progress value={Math.min(data.co2Offset * 10, 100)} className="h-1" />
//               </div>
//             </div>

//             <div className="mt-4">
//               <h4 className="text-sm font-medium mb-2">Monthly Impact Trend</h4>
//               <div className="h-[220px] w-full bg-white dark:bg-muted/10 rounded-lg border">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={mockTrendData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
//                     <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line
//                       type="monotone"
//                       dataKey="minutesSaved"
//                       name="Minutes Saved"
//                       stroke="hsl(var(--primary))"
//                       strokeWidth={2}
//                       dot={{ r: 3 }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="costSaved"
//                       name="Cost Saved (₹L)"
//                       stroke="hsl(var(--secondary))"
//                       strokeWidth={2}
//                       dot={{ r: 3 }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </>
//         ) : null}
//       </CardContent>
//     </Card>
//   );
// };

// export default SmartStopImpactCard;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { fetchSmartStopData } from '@/services/dashboardService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const SmartStopImpactCard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['smartStopData'],
    queryFn: fetchSmartStopData,
    refetchInterval: 45000,
  });

  // Bar chart data showing Before vs After comparison
  const barChartData = [
    {
      category: 'Before',
      minutesSaved: 0,
      costSaved: 0,
    },
    {
      category: 'After',
      minutesSaved: data?.minutesSaved ?? 8.0,
      costSaved: data?.costSaved ?? 1.9,
    }
  ];

  return (
    <Card className="dashboard-card col-span-6 md:col-span-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Smart Stop Operational Impact</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 animate-pulse">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 bg-muted/50 rounded-md w-3/4"></div>
                <div className="h-5 bg-muted/30 rounded-md w-full"></div>
                <div className="h-1 bg-muted/20 rounded-md w-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive">Error loading impact data</div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="space-y-2">
                <p className="stat-value">{data.minutesSaved.toFixed(1)}</p>
                <p className="stat-label">Minutes saved per scan</p>
                <Progress value={Math.min(data.minutesSaved * 10, 100)} className="h-1" />
              </div>
              <div className="space-y-2">
                <p className="stat-value">{data.radiationAvoided}</p>
                <p className="stat-label">Radiation avoided (mSv)</p>
                <Progress value={Math.min(data.radiationAvoided / 20, 100)} className="h-1" />
              </div>
              <div className="space-y-2">
                <p className="stat-value">{data.powerSaved.toLocaleString()}</p>
                <p className="stat-label">Power saved (kWh)</p>
                <Progress value={Math.min(data.powerSaved / 400, 100)} className="h-1" />
              </div>
              <div className="space-y-2">
                <p className="stat-value">₹{data.costSaved.toFixed(1)}L</p>
                <p className="stat-label">Cost saved in rescans</p>
                <Progress value={Math.min(data.costSaved * 10, 100)} className="h-1" />
              </div>
              <div className="space-y-2">
                <p className="stat-value">{data.co2Offset.toFixed(1)}T</p>
                <p className="stat-label">CO₂ offset (metric tons)</p>
                <Progress value={Math.min(data.co2Offset * 10, 100)} className="h-1" />
              </div>
            </div>

            <div className="mt-4">
              <div className="h-[220px] w-full bg-white dark:bg-muted/10 rounded-lg border">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={barChartData} 
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                    barCategoryGap="40%"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="category" 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 'dataMax + 2']}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'minutesSaved' ? `${value} min` : `₹${value}L`,
                        name === 'minutesSaved' ? 'Minutes Saved' : 'Cost Saved'
                      ]}
                    />
                    <Bar
                      dataKey="minutesSaved"
                      name="Minutes Saved"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={60}
                    />
                    <Bar
                      dataKey="costSaved"
                      name="Cost Saved"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default SmartStopImpactCard;