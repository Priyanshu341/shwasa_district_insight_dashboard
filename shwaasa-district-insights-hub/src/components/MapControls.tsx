import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ZoomIn, ZoomOut, Maximize, Layers, Download, Settings } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onRenderModeChange: (mode: string) => void;
  onExport: () => void;
  renderMode: string;
  showSettings?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onRenderModeChange,
  onExport,
  renderMode,
  showSettings = true,
}) => {
  return (
    <div className="absolute top-2 left-2 z-10 flex flex-col gap-2 bg-background/90 p-2 rounded-md border shadow-sm">
      <div className="flex flex-col gap-1">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onReset}>
          <Maximize className="h-4 w-4" />
        </Button>
      </div>
      
      {showSettings && (
        <>
          <div className="border-t pt-2">
            <Select value={renderMode} onValueChange={onRenderModeChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="heatmap">Heatmap</SelectItem>
                <SelectItem value="choropleth">Choropleth</SelectItem>
                <SelectItem value="dotdensity">Dot Density</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={onExport}>
            <Download className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};