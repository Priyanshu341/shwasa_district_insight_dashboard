
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import DistrictHeatmap from '@/components/DistrictHeatmap';
import ScanVolumeCard from '@/components/ScanVolumeCard';
import FacilityPerformanceTable from '@/components/FacilityPerformanceTable';
import HighRiskZoneMap from '@/components/HighRiskZoneMap';
import SmartStopImpactCard from '@/components/SmartStopImpactCard';
import AiPerformancePanel from '@/components/AiPerformancePanel';
import AlertsFeed from '@/components/AlertsFeed';
import AbdmExportBar from '@/components/AbdmExportBar';
import { useMediaQuery } from '@/hooks/use-mobile';

/**
 * Main Dashboard Page
 * 
 * This component serves as the entry point for the dashboard application.
 * It organizes all dashboard components in a responsive grid layout and
 * handles the initial loading state.
 * 
 * Data Flow:
 * - Each child component fetches its own data through the dashboardService
 * - Components use React Query for data fetching, caching, and refetching
 */
const Index = () => {
  // Loading state for initial dashboard render
  const [loading, setLoading] = useState(true);
  
  // Detect mobile devices for responsive layout adjustments
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // Simulate initial loading for dashboard components
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Staged loading animation for dashboard components with cascading delays
  const getAnimationDelay = (index: number) => ({
    animationDelay: `${0.1 + (index * (isMobile ? 0.15 : 0.1))}s`, 
  });
  
  // Show loading spinner while initializing
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background bg-[radial-gradient(ellipse_at_bottom_right,rgba(var(--primary-rgb),0.15),transparent_70%)]">
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="mt-4 text-lg font-medium">Loading dashboard...</p>
        <p className="text-sm text-muted-foreground">Connecting to Telangana Health Services</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(var(--primary-rgb),0.08),transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(var(--secondary-rgb),0.08),transparent_70%)] pointer-events-none"></div>
      
      <DashboardHeader />
      
      <main className="flex-1 p-3 md:p-4 lg:p-6 animate-fade-in relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4 lg:gap-6">
          {/* District Disease Map - Full width on all screens */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-12 animate-slide-in" style={getAnimationDelay(0)}>
            <DistrictHeatmap />
          </div>
          
          {/* Scan Volume Card - Full width on mobile, 8/12 on larger screens */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-8 animate-slide-in transform transition-all duration-300 hover:translate-y-[-2px]" style={getAnimationDelay(1)}>
            <ScanVolumeCard />
          </div>
          
          {/* Risk Zone Map - Full width on mobile, 4/12 on larger screens */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 animate-slide-in transform transition-all duration-300 hover:translate-y-[-2px]" style={getAnimationDelay(2)}>
            <HighRiskZoneMap />
          </div>
          
          {/* Facility Performance Table - Always full width */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-12 animate-slide-in transform transition-all duration-300 hover:translate-y-[-2px]" style={getAnimationDelay(3)}>
            <FacilityPerformanceTable />
          </div>
          
          {/* SmartStop Impact Card - Full width on mobile, 8/12 on larger screens */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-8 animate-slide-in transform transition-all duration-300 hover:translate-y-[-2px]" style={getAnimationDelay(4)}>
            <SmartStopImpactCard />
          </div>
          
          {/* Alerts Feed - Full width on mobile, 4/12 on larger screens */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 animate-slide-in transform transition-all duration-300 hover:translate-y-[-2px]" style={getAnimationDelay(5)}>
            <AlertsFeed />
          </div>
          
          {/* AI Performance Panel - Always full width */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-12 animate-slide-in transform transition-all duration-300 hover:translate-y-[-2px]" style={getAnimationDelay(6)}>
            <AiPerformancePanel />
          </div>
        </div>
      </main>
      
      <footer className="sticky bottom-0 z-10 animate-slide-in" style={getAnimationDelay(7)}>
        <AbdmExportBar />
      </footer>
    </div>
  );
};

export default Index;
