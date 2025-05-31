import React from 'react';

interface MapLegendProps {
  renderMode: string;
  activeDisease: string;
  data: any[];
}

export const MapLegend: React.FC<MapLegendProps> = ({ renderMode, activeDisease, data }) => {
  const getLegendContent = () => {
    switch (renderMode) {
      case 'heatmap':
        return (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Case Intensity</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-200 to-blue-800 rounded"></div>
                <span className="text-xs">Low to High</span>
              </div>
            </div>
          </div>
        );
      case 'choropleth':
        return (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Risk Level</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500/80 rounded-full"></div>
                <span className="text-xs">High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500/80 rounded-full"></div>
                <span className="text-xs">Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500/80 rounded-full"></div>
                <span className="text-xs">Low Risk</span>
              </div>
            </div>
          </div>
        );
      case 'dotdensity':
        return (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Case Distribution</h4>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-xs">10 cases per dot</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute bottom-4 right-4 bg-background/90 p-3 rounded-md border shadow-lg backdrop-blur-sm">
      {getLegendContent()}
    </div>
  );
};