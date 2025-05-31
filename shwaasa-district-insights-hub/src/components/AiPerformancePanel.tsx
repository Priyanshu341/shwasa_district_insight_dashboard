import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { fetchAiPerformanceData } from '@/services/dashboardService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const AiPerformancePanel = () => {
  const [activeTab, setActiveTab] = React.useState('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['aiPerformance', activeTab],
    queryFn: () => fetchAiPerformanceData(),
    refetchInterval: 60000,
  });

  const isValidNumber = (value: any) => typeof value === 'number' && !isNaN(value);

  // Mock trend data with current backend values
  const trendData = [
    { month: 'Jan', precision: 91.2, confidence: 87 },
    { month: 'Feb', precision: 92.0, confidence: 88 },
    { month: 'Mar', precision: 92.5, confidence: 89 },
    { month: 'Apr', precision: 93.1, confidence: 90 },
    { month: 'May', precision: 93.6, confidence: 91 },
    {
      month: 'Now',
      precision: isValidNumber(data?.precision) ? data.precision : 93.2,
      confidence: data?.confidenceDistribution?.high ?? 88
    }
  ];

  return (
    <Card className="dashboard-card col-span-6 md:col-span-8">
      <CardHeader className="pb-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">AI Performance Summary</CardTitle>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="tb">TB</TabsTrigger>
              <TabsTrigger value="copd">COPD</TabsTrigger>
              <TabsTrigger value="pneumonia">Pneumonia</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 animate-pulse">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-muted/50 rounded-lg"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive">Error loading AI performance data</div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              {/* Precision */}
              <div>
                <h4 className="text-sm font-medium mb-2">Precision Score</h4>
                <div className="flex items-center space-x-2">
                  <div className="text-3xl font-bold text-primary">
                    {isValidNumber(data.precision) ? `${data.precision.toFixed(1)}%` : 'N/A'}
                  </div>
                  {isValidNumber(data.change) && (
                    <span className={`text-xs px-2 py-0.5 rounded 
                      ${data.change > 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'}`}>
                      {data.change > 0 ? '+' : ''}{data.change}%
                    </span>
                  )}
                </div>
                <Progress value={isValidNumber(data.precision) ? data.precision : 0} className="h-1 mt-2" />
              </div>

              {/* Confidence Distribution */}
              <div>
                <h4 className="text-sm font-medium mb-2">Confidence Distribution</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">High (90%+)</span>
                    <span className="text-xs font-semibold">{data.confidenceDistribution?.high ?? 'N/A'}%</span>
                  </div>
                  <Progress value={data.confidenceDistribution?.high || 0} className="h-1 bg-green-100" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs">Medium (70–90%)</span>
                    <span className="text-xs font-semibold">{data.confidenceDistribution?.medium ?? 'N/A'}%</span>
                  </div>
                  <Progress value={data.confidenceDistribution?.medium || 0} className="h-1 bg-amber-100" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs">Low (&lt;70%)</span>
                    <span className="text-xs font-semibold">{data.confidenceDistribution?.low ?? 'N/A'}%</span>
                  </div>
                  <Progress value={data.confidenceDistribution?.low || 0} className="h-1 bg-red-100" />
                </div>
              </div>

              {/* Response Time */}
              <div>
                <h4 className="text-sm font-medium mb-2">AI Response Time</h4>
                <div className="text-3xl font-bold text-primary">
                  {isValidNumber(data.responseTime?.average) ? `${data.responseTime.average}s` : 'N/A'}
                </div>
                <p className="text-sm text-muted-foreground">Average response time</p>
                <div className="flex items-center gap-2 mt-2">
                  <div>
                    <p className="text-xs font-medium">Peak</p>
                    <p className="text-sm">{data.responseTime?.peak ?? 'N/A'}s</p>
                  </div>
                  <div className="h-8 border-l"></div>
                  <div>
                    <p className="text-xs font-medium">Lowest</p>
                    <p className="text-sm">{data.responseTime?.lowest ?? 'N/A'}s</p>
                  </div>
                  <div className="h-8 border-l"></div>
                  <div>
                    <p className="text-xs font-medium">Target</p>
                    <p className={`text-sm ${data.responseTime?.targetMet ? 'text-green-600' : 'text-red-600'}`}>
                      {data.responseTime?.targetMet ? '✓ Met' : '✗ Not Met'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div>
              <h4 className="text-sm font-medium mb-2">Monthly Trend</h4>
              <div className="h-[220px] w-full bg-white dark:bg-muted/10 rounded-lg border">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="precision"
                      name="Precision %"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="confidence"
                      name="Confidence %"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default AiPerformancePanel;
