import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Palette, Eye, Zap, Download, Share, RefreshCw } from 'lucide-react';

// Configuration interfaces
interface MapConfiguration {
  theme: string;
  renderMode: 'heatmap' | 'choropleth' | 'dotdensity' | 'isopleth';
  transitionDuration: number;
  showLabels: boolean;
  showWaterBodies: boolean;
  showRoads: boolean;
  enableAnimation: boolean;
  minZoom: number;
  maxZoom: number;
  clustering: {
    enabled: boolean;
    threshold: number;
  };
  performance: {
    enableVirtualization: boolean;
    debounceMs: number;
    maxFeatures: number;
  };
}

const defaultMapConfig: MapConfiguration = {
  theme: 'default',
  renderMode: 'heatmap',
  transitionDuration: 300,
  showLabels: true,
  showWaterBodies: false,
  showRoads: false,
  enableAnimation: true,
  minZoom: 0.5,
  maxZoom: 5,
  clustering: {
    enabled: false,
    threshold: 50,
  },
  performance: {
    enableVirtualization: true,
    debounceMs: 300,
    maxFeatures: 1000,
  },
};

const mapThemes = {
  default: {
    name: 'Default',
    colors: {
      background: '#f8fafc',
      border: '#e2e8f0',
      selected: '#3b82f6',
      labels: '#1e293b',
      water: '#60a5fa',
      roads: '#6b7280',
    },
    diseases: {
      tb: { primary: '#ef4444', gradient: ['#fef2f2', '#ef4444'] },
      copd: { primary: '#f59e0b', gradient: ['#fffbeb', '#f59e0b'] },
      pneumonia: { primary: '#06b6d4', gradient: ['#f0fdff', '#06b6d4'] },
      fibrosis: { primary: '#8b5cf6', gradient: ['#faf5ff', '#8b5cf6'] },
    },
    riskLevels: {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      background: '#1e293b',
      border: '#475569',
      selected: '#60a5fa',
      labels: '#f1f5f9',
      water: '#1e40af',
      roads: '#9ca3af',
    },
    diseases: {
      tb: { primary: '#f87171', gradient: ['#1f2937', '#f87171'] },
      copd: { primary: '#fbbf24', gradient: ['#1f2937', '#fbbf24'] },
      pneumonia: { primary: '#22d3ee', gradient: ['#1f2937', '#22d3ee'] },
      fibrosis: { primary: '#a78bfa', gradient: ['#1f2937', '#a78bfa'] },
    },
    riskLevels: {
      low: '#34d399',
      medium: '#fbbf24',
      high: '#f87171',
    },
  },
};

// Utility functions
const MapUtils = {
  getTheme: (themeName: string) => mapThemes[themeName as keyof typeof mapThemes] || mapThemes.default,
  
  calculateDataRange: (data: any[], field: string) => {
    const values = data.map(d => d[field] || 0).filter(v => typeof v === 'number');
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  },

  normalizeValue: (value: number, min: number, max: number) => {
    if (max === min) return 0;
    return (value - min) / (max - min);
  },

  getColorForValue: (value: number, range: { min: number; max: number }, gradient: string[]) => {
    const normalized = MapUtils.normalizeValue(value, range.min, range.max);
    // Simple interpolation between first and last color
    const opacity = 0.3 + normalized * 0.7;
    return gradient[1] + Math.round(opacity * 255).toString(16).padStart(2, '0');
  },

  debounce: <T extends (...args: any[]) => void>(func: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
  },
};

// District path and centroid functions with proper Telangana district data
const telanganaDistrictPaths: Record<string, string> = {
  'hyd': 'M200,200 L280,200 L280,280 L200,280 Z',
  'war': 'M320,150 L400,150 L400,230 L320,230 Z',
  'kar': 'M150,100 L230,100 L230,180 L150,180 Z',
  'nil': 'M100,50 L180,50 L180,130 L100,130 Z',
  'med': 'M120,180 L200,180 L200,260 L120,260 Z',
  'ran': 'M250,250 L330,250 L330,330 L250,330 Z',
  'default': 'M50,50 L100,50 L100,100 L50,100 Z',
};

const telanganaDistrictCentroids: Record<string, { x: number; y: number }> = {
  'hyd': { x: 240, y: 240 },
  'war': { x: 360, y: 190 },
  'kar': { x: 190, y: 140 },
  'nil': { x: 140, y: 90 },
  'med': { x: 160, y: 220 },
  'ran': { x: 290, y: 290 },
  'default': { x: 75, y: 75 },
};

const getDistrictPath = (districtId: string, width: number, height: number): string => {
  // Return the predefined path or create a generic one
  const path = telanganaDistrictPaths[districtId] || telanganaDistrictPaths['default'];
  
  // Scale the path if needed based on width/height
  if (width !== 500 || height !== 500) {
    const scaleX = width / 500;
    const scaleY = height / 500;
    // Simple scaling - in a real app, you'd use proper SVG transform
    return path.replace(/(\d+)/g, (match) => {
      const num = parseInt(match);
      return Math.round(num * (scaleX + scaleY) / 2).toString();
    });
  }
  
  return path;
};

const getDistrictCentroid = (districtId: string, width: number, height: number): { x: number; y: number } => {
  // Return the predefined centroid or create a generic one
  const centroid = telanganaDistrictCentroids[districtId] || telanganaDistrictCentroids['default'];
  
  // Scale the centroid if needed
  if (width !== 500 || height !== 500) {
    const scaleX = width / 500;
    const scaleY = height / 500;
    return {
      x: centroid.x * scaleX,
      y: centroid.y * scaleY,
    };
  }
  
  return centroid;
};

interface ConfigurableMapProps {
  data: any[];
  activeField: string;
  onConfigChange?: (config: MapConfiguration) => void;
}

export const ConfigurableMap: React.FC<ConfigurableMapProps> = ({
  data,
  activeField,
  onConfigChange,
}) => {
  const [config, setConfig] = useState<MapConfiguration>(defaultMapConfig);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentTheme = useMemo(() => MapUtils.getTheme(config.theme), [config.theme]);
  
  const dataRange = useMemo(
    () => MapUtils.calculateDataRange(data, activeField),
    [data, activeField]
  );

  const updateConfig = useCallback((updates: Partial<MapConfiguration>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  }, [config, onConfigChange]);

  const debouncedUpdateConfig = useMemo(
    () => MapUtils.debounce(updateConfig, config.performance.debounceMs),
    [updateConfig, config.performance.debounceMs]
  );

  const handleExport = useCallback(async (format: 'svg' | 'png') => {
    setIsLoading(true);
    try {
      const mapElement = document.querySelector('.configurable-map-container svg');
      if (!mapElement) return;

      if (format === 'svg') {
        const svgData = new XMLSerializer().serializeToString(mapElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const svgLink = document.createElement('a');
        svgLink.href = svgUrl;
        svgLink.download = `telangana-map-${Date.now()}.svg`;
        svgLink.click();
        URL.revokeObjectURL(svgUrl);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleShare = useCallback(() => {
    const shareData = {
      config,
      timestamp: Date.now(),
      field: activeField,
    };
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?mapConfig=${encodeURIComponent(JSON.stringify(shareData))}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Telangana Health Map Configuration',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  }, [config, activeField]);

  return (
    <div className="space-y-4">
      {/* Main Map Container */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Interactive Disease Map</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share className="h-4 w-4" />
              </Button>
              <Select onValueChange={(format) => handleExport(format as any)}>
                <SelectTrigger className="w-24">
                  <Download className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="svg">SVG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="configurable-map-container relative h-96 bg-gradient-to-br from-background to-muted/30">
            <EnhancedMapRenderer
              config={config}
              theme={currentTheme}
              data={data}
              activeField={activeField}
              dataRange={dataRange}
            />
            
            {isLoading && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <div className="flex items-center gap-2 bg-background p-3 rounded-md shadow-md">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Map Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="appearance" className="flex items-center gap-1">
                  <Palette className="h-3 w-3" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="display" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Display
                </TabsTrigger>
                <TabsTrigger value="behavior" className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Behavior
                </TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="appearance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <Select
                      value={config.theme}
                      onValueChange={(theme) => updateConfig({ theme })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(mapThemes).map(([key, theme]) => (
                          <SelectItem key={key} value={key}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Render Mode</label>
                    <Select
                      value={config.renderMode}
                      onValueChange={(renderMode: any) => updateConfig({ renderMode })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heatmap">Heatmap</SelectItem>
                        <SelectItem value="choropleth">Choropleth</SelectItem>
                        <SelectItem value="dotdensity">Dot Density</SelectItem>
                        <SelectItem value="isopleth">Isopleth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Transition Duration: {config.transitionDuration}ms
                  </label>
                  <Slider
                    value={[config.transitionDuration]}
                    onValueChange={([value]) => debouncedUpdateConfig({ transitionDuration: value })}
                    min={0}
                    max={1000}
                    step={50}
                    className="w-full"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="display" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Show Labels</label>
                    <Switch
                      checked={config.showLabels}
                      onCheckedChange={(showLabels) => updateConfig({ showLabels })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Show Water Bodies</label>
                    <Switch
                      checked={config.showWaterBodies}
                      onCheckedChange={(showWaterBodies) => updateConfig({ showWaterBodies })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Show Roads</label>
                    <Switch
                      checked={config.showRoads}
                      onCheckedChange={(showRoads) => updateConfig({ showRoads })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Enable Animation</label>
                    <Switch
                      checked={config.enableAnimation}
                      onCheckedChange={(enableAnimation) => updateConfig({ enableAnimation })}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="behavior" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Zoom Range: {config.minZoom}x - {config.maxZoom}x
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Min Zoom</label>
                        <Slider
                          value={[config.minZoom]}
                          onValueChange={([minZoom]) => updateConfig({ minZoom })}
                          min={0.1}
                          max={2}
                          step={0.1}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Max Zoom</label>
                        <Slider
                          value={[config.maxZoom]}
                          onValueChange={([maxZoom]) => updateConfig({ maxZoom })}
                          min={2}
                          max={10}
                          step={0.5}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Enable Clustering</label>
                    <Switch
                      checked={config.clustering.enabled}
                      onCheckedChange={(enabled) => 
                        updateConfig({ clustering: { ...config.clustering, enabled } })
                      }
                    />
                  </div>
                  
                  {config.clustering.enabled && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Clustering Threshold: {config.clustering.threshold}
                      </label>
                      <Slider
                        value={[config.clustering.threshold]}
                        onValueChange={([threshold]) => 
                          updateConfig({ clustering: { ...config.clustering, threshold } })
                        }
                        min={10}
                        max={200}
                        step={10}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Enable Virtualization</label>
                    <Switch
                      checked={config.performance.enableVirtualization}
                      onCheckedChange={(enableVirtualization) => 
                        updateConfig({ 
                          performance: { ...config.performance, enableVirtualization } 
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Debounce Delay: {config.performance.debounceMs}ms
                    </label>
                    <Slider
                      value={[config.performance.debounceMs]}
                      onValueChange={([debounceMs]) => 
                        updateConfig({ 
                          performance: { ...config.performance, debounceMs } 
                        })
                      }
                      min={100}
                      max={1000}
                      step={50}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Max Features: {config.performance.maxFeatures}
                    </label>
                    <Slider
                      value={[config.performance.maxFeatures]}
                      onValueChange={([maxFeatures]) => 
                        updateConfig({ 
                          performance: { ...config.performance, maxFeatures } 
                        })
                      }
                      min={100}
                      max={5000}
                      step={100}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setConfig(defaultMapConfig)}
              >
                Reset to Default
              </Button>
              <div className="text-xs text-muted-foreground">
                Data points: {data.length} | Theme: {currentTheme.name}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface EnhancedMapRendererProps {
  config: MapConfiguration;
  theme: any;
  data: any[];
  activeField: string;
  dataRange: { min: number; max: number };
}

const EnhancedMapRenderer: React.FC<EnhancedMapRendererProps> = ({
  config,
  theme,
  data,
  activeField,
  dataRange,
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState('0 0 500 500');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const getDistrictColor = useCallback((district: any) => {
    if (!district || !district[activeField]) return theme.colors.background;

    const value = district[activeField];
    const diseaseTheme = theme.diseases[activeField];
    
    switch (config.renderMode) {
      case 'heatmap':
        if (diseaseTheme) {
          return MapUtils.getColorForValue(value, dataRange, diseaseTheme.gradient);
        }
        return theme.colors.background;
        
      case 'choropleth':
        const riskLevel = district.riskLevel || 'low';
        return theme.riskLevels[riskLevel as keyof typeof theme.riskLevels];
        
      case 'dotdensity':
        return theme.colors.background;
        
      case 'isopleth':
        const normalized = MapUtils.normalizeValue(value, dataRange.min, dataRange.max);
        return `rgba(99, 102, 241, ${0.2 + normalized * 0.6})`;
        
      default:
        return theme.colors.background;
    }
  }, [config.renderMode, activeField, dataRange, theme]);

  // Real-time data updates effect
  React.useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const districts = svg.querySelectorAll('.district-path');
    
    districts.forEach((district) => {
      const districtId = district.getAttribute('data-district-id');
      const districtData = data.find(d => d.id === districtId);
      
      if (districtData && config.enableAnimation) {
        const newColor = getDistrictColor(districtData);
        (district as SVGElement).style.transition = `fill ${config.transitionDuration}ms ease-in-out`;
        district.setAttribute('fill', newColor);
      }
    });
  }, [data, getDistrictColor, config.enableAnimation, config.transitionDuration]);

  return (
    <div className="w-full h-full relative">
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full h-full"
        style={{ background: theme.colors.background }}
      >
        {/* Render districts */}
        {data.map((district) => {
          // Check if district has valid path data
          const path = getDistrictPath(district.id, 500, 500);
          const centroid = getDistrictCentroid(district.id, 500, 500);
          
          // Skip rendering if path is invalid
          if (!path || path === telanganaDistrictPaths['default']) {
            console.warn(`No path data found for district: ${district.id}`);
          }
          
          return (
            <g key={district.id}>
              <path
                d={path}
                fill={getDistrictColor(district)}
                stroke={selectedDistrict === district.id ? theme.colors.selected : theme.colors.border}
                strokeWidth={selectedDistrict === district.id ? 2 : 1}
                className="district-path cursor-pointer transition-all duration-300 hover:stroke-2"
                data-district-id={district.id}
                onClick={() => setSelectedDistrict(
                  selectedDistrict === district.id ? null : district.id
                )}
                onMouseEnter={(e) => {
                  // Add hover effect
                  e.currentTarget.style.strokeWidth = '2';
                }}
                onMouseLeave={(e) => {
                  // Remove hover effect if not selected
                  if (selectedDistrict !== district.id) {
                    e.currentTarget.style.strokeWidth = '1';
                  }
                }}
              />
              
              {config.showLabels && (
                <text
                  x={centroid.x}
                  y={centroid.y}
                  textAnchor="middle"
                  fontSize="8"
                  fill={theme.colors.labels}
                  className="pointer-events-none select-none"
                >
                  {district.name || district.id}
                </text>
              )}
              
              {config.renderMode === 'dotdensity' && (
                <DotDensityLayer
                  district={district}
                  centroid={centroid}
                  activeField={activeField}
                  theme={theme}
                />
              )}
            </g>
          );
        })}
        
        {/* Water bodies */}
        {config.showWaterBodies && (
          <g className="water-bodies">
            <path
              d="M420,180 Q450,200 430,230 Q410,260 380,240 Q360,220 370,180 Q380,150 420,180 Z"
              fill={theme.colors.water}
              stroke={theme.colors.water}
              strokeWidth="1"
            />
          </g>
        )}
        
        {/* Roads */}
        {config.showRoads && (
          <g className="roads">
            <path
              d="M250,50 Q280,120 320,150 Q370,180 410,230 Q430,270 450,300"
              fill="none"
              stroke={theme.colors.roads}
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

// Dot Density Layer Component
const DotDensityLayer: React.FC<{
  district: any;
  centroid: { x: number; y: number };
  activeField: string;
  theme: any;
}> = ({ district, centroid, activeField, theme }) => {
  const dotCount = Math.min(Math.floor((district[activeField] || 0) / 10), 15);
  
  return (
    <>
      {Array.from({ length: dotCount }, (_, i) => {
        const angle = (i / dotCount) * 2 * Math.PI;
        const radius = 8 + (i % 3) * 4;
        const x = centroid.x + Math.cos(angle) * radius;
        const y = centroid.y + Math.sin(angle) * radius;
        
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1.5"
            fill={theme.diseases[activeField]?.primary || '#3b82f6'}
            opacity="0.8"
          />
        );
      })}
    </>
  );
};