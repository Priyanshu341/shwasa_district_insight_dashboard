
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Map, MapPin, CircleDot, Layers, Compass, ZoomIn, ZoomOut, Maximize, Move } from 'lucide-react';
import { 
  getDistrictPath, 
  getDistrictCentroid, 
  telanganaDistrictBoundaries,
  getAllDistrictIds
} from '@/utils/telanganaGeoData';

const HighRiskZoneMap = () => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapWidth = 500;
  const mapHeight = 500;
  
  // Zoom and pan state
  const [viewBox, setViewBox] = useState(`0 0 ${mapWidth} ${mapHeight}`);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const riskZones = [
    {
      id: 'adilabad',
      name: 'Adilabad District',
      description: 'TB cluster detected',
      status: 'alert',
      recommendation: 'Deploy mobile screening van',
      coordinates: { x: 0, y: 0 }, // Will be set from district centroid
    },
    {
      id: 'warangal',
      name: 'Warangal Rural',
      description: 'COPD prevalence rising',
      status: 'escalating',
      recommendation: 'Alert nodal officers',
      coordinates: { x: 0, y: 0 }, // Will be set from district centroid
    },
    {
      id: 'karimnagar',
      name: 'Karimnagar West',
      description: 'Pneumonia cases monitored',
      status: 'stable',
      recommendation: 'Continue routine screening',
      coordinates: { x: 0, y: 0 }, // Will be set from district centroid
    },
    {
      id: 'nizamabad',
      name: 'Nizamabad',
      description: 'TB screening enhanced',
      status: 'stable',
      recommendation: 'Continue monitoring',
      coordinates: { x: 0, y: 0 }, // Will be set from district centroid
    },
    {
      id: 'khammam',
      name: 'Khammam',
      description: 'COPD cases reducing',
      status: 'stable',
      recommendation: 'Maintain current protocols',
      coordinates: { x: 0, y: 0 }, // Will be set from district centroid
    },
    {
      id: 'hyderabad',
      name: 'Hyderabad Central',
      description: 'Software deployment active',
      status: 'alert',
      recommendation: 'Increase training sessions',
      coordinates: { x: 0, y: 0 }, // Will be set from district centroid
    }
  ];

  // Set proper coordinates from centroids when component mounts
  useEffect(() => {
    const updatedRiskZones = riskZones.map(zone => {
      const centroid = getDistrictCentroid(zone.id, mapWidth, mapHeight);
      return {
        ...zone,
        coordinates: centroid
      };
    });

    // This is just to update the internal state for rendering
    // We're not setting this with useState as we don't need to trigger re-renders
    riskZones.forEach((zone, index) => {
      riskZones[index].coordinates = updatedRiskZones[index].coordinates;
    });
  }, []);

  const handleDistrictClick = (districtId: string) => {
    console.log(`District clicked: ${districtId}`);
    
    if (activeDistrict === districtId) {
      setActiveDistrict(null);
      setSelectedZone(null);
    } else {
      setActiveDistrict(districtId);
      
      // If the district has a risk zone, also select that
      const matchingZone = riskZones.find(zone => zone.id === districtId);
      if (matchingZone) {
        console.log(`Matching zone found: ${matchingZone.id}`);
        setSelectedZone(matchingZone.id);
      } else {
        setSelectedZone(null);
      }
    }
  };

  const handlePinClick = (zoneId: string) => {
    console.log(`Pin clicked: ${zoneId}`);
    
    if (selectedZone === zoneId) {
      setSelectedZone(null);
      setActiveDistrict(null);
    } else {
      setSelectedZone(zoneId);
      // Also activate the district where this zone is located
      setActiveDistrict(zoneId);
    }
  };
  
  const getSelectedZoneDetails = () => {
    if (!selectedZone) return null;
    const zone = riskZones.find(zone => zone.id === selectedZone);
    console.log(`Selected zone details:`, zone);
    return zone;
  };

  // Zoom and pan handlers
  const handleZoomIn = useCallback(() => {
    setScale(prevScale => {
      const newScale = prevScale * 1.2;
      return Math.min(newScale, 5); // Maximum zoom level
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prevScale => {
      const newScale = prevScale / 1.2;
      return Math.max(newScale, 0.5); // Minimum zoom level
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Update viewBox when scale or position changes
  useEffect(() => {
    if (!svgRef.current) return;

    // Calculate center point of the SVG
    const centerX = mapWidth / 2;
    const centerY = mapHeight / 2;

    // Calculate new viewBox dimensions based on scale
    const newWidth = mapWidth / scale;
    const newHeight = mapHeight / scale;

    // Calculate new viewBox position to keep the center point
    const offsetX = centerX - newWidth / 2 - position.x / scale;
    const offsetY = centerY - newHeight / 2 - position.y / scale;

    // Update viewBox
    setViewBox(`${offsetX} ${offsetY} ${newWidth} ${newHeight}`);

  }, [scale, position, mapWidth, mapHeight]);

  // Add wheel event listener for zooming
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleZoomIn, handleZoomOut]);

  // Handle document mouse events to continue drag outside of SVG
  useEffect(() => {
    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleDocumentMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleDocumentMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, [isDragging, dragStart]);

  const selectedZoneDetails = getSelectedZoneDetails();
  console.log(`Current selectedZone state: ${selectedZone}`);
  console.log(`Current activeDistrict state: ${activeDistrict}`);
  console.log(`Selected zone details in render: `, selectedZoneDetails);

  // Get unique district IDs that have risk zones
  const riskZoneDistrictIds = Array.from(new Set(riskZones.map(zone => zone.id)));
  
  return (
    <Card className="dashboard-card col-span-6 md:col-span-4 h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Telangana High-Risk Zones</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> {riskZones.filter(zone => zone.status === 'alert').length} Alerts
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Layers className="h-3 w-3" /> {telanganaDistrictBoundaries.features.length} Districts
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[300px] mb-4 rounded-lg border relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
          {/* Map controls */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-2 bg-background/90 p-1 rounded-md border shadow-sm">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={handleZoomIn}
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={handleReset}
              title="Reset View"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Interactive map container */}
          <div 
            ref={containerRef} 
            className="w-full h-full relative cursor-grab overflow-hidden"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className="absolute inset-0">
              <Map className="absolute top-2 right-2 h-5 w-5 text-muted-foreground opacity-50" />
              
              {/* SVG Map of Telangana - Interactive with pan and zoom */}
              <svg 
                ref={svgRef}
                viewBox={viewBox}
                className="w-full h-full absolute inset-0"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Background pattern */}
                <defs>
                  <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(180,180,180,0.1)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width={mapWidth} height={mapHeight} fill="url(#gridPattern)" />
                
                {/* Large water bodies - rivers and lakes */}
                <path 
                  d="M420,180 Q450,200 430,230 Q410,260 380,240 Q360,220 370,180 Q380,150 420,180 Z" 
                  fill="rgba(186,230,253,0.6)" 
                  stroke="rgba(186,230,253,0.8)" 
                  strokeWidth="1"
                  className="dark:opacity-30"
                />
                <path
                  d="M100,320 Q140,330 180,380 Q220,420 120,440 Q60,430 80,380 Q90,350 100,320 Z"
                  fill="rgba(186,230,253,0.6)"
                  stroke="rgba(186,230,253,0.8)"
                  strokeWidth="1"
                  className="dark:opacity-30"
                />
                
                {/* Rivers */}
                <path
                  d="M250,50 Q280,120 320,150 Q370,180 410,230 Q430,270 450,300"
                  fill="none"
                  stroke="rgba(186,230,253,0.8)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="1 3"
                  className="dark:opacity-40"
                />
                <path
                  d="M50,250 Q100,270 150,280 Q200,300 220,350 Q240,380 230,430"
                  fill="none"
                  stroke="rgba(186,230,253,0.8)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="1 3"
                  className="dark:opacity-40"
                />
                
                {/* State border - giving depth */}
                <path 
                  d="M80,250 Q180,120 310,90 Q420,160 450,280 Q370,390 200,410 Q120,350 80,250 Z" 
                  fill="none" 
                  stroke="#94a3b8" 
                  strokeWidth="2.5"
                  strokeDasharray="5,3"
                  className="opacity-40"
                />
                
                {/* Districts - using GeoJSON data */}
                {telanganaDistrictBoundaries.features.map((feature) => {
                  const districtId = feature.properties.id;
                  const districtName = feature.properties.name;
                  const path = getDistrictPath(districtId, mapWidth, mapHeight);
                  const centroid = getDistrictCentroid(districtId, mapWidth, mapHeight);
                  
                  // Determine if this district has a risk zone
                  const hasRiskZone = riskZoneDistrictIds.includes(districtId);
                  const riskZone = riskZones.find(zone => zone.id === districtId);
                  const riskStatus = riskZone?.status || 'none';
                  
                  // Set fill color based on risk status
                  let fillColor = 'rgba(255,255,255,0.8)';
                  if (activeDistrict === districtId) {
                    fillColor = 'rgba(var(--primary-rgb), 0.2)';
                  } else if (hasRiskZone) {
                    switch (riskStatus) {
                      case 'alert':
                        fillColor = 'rgba(239,68,68,0.15)';
                        break;
                      case 'escalating':
                        fillColor = 'rgba(245,158,11,0.15)';
                        break;
                      case 'stable':
                        fillColor = 'rgba(34,197,94,0.1)';
                        break;
                    }
                  }
                  
                  return (
                    <g key={districtId}>
                      <path 
                        d={path}
                        fill={fillColor}
                        stroke={activeDistrict === districtId ? 'hsl(var(--primary))' : '#cbd5e1'}
                        strokeWidth={activeDistrict === districtId ? 2 : 1}
                        className="transition-all duration-300 hover:fill-primary/10 hover:stroke-primary/70 cursor-pointer"
                        onClick={() => handleDistrictClick(districtId)}
                        filter={activeDistrict === districtId ? "drop-shadow(0 1px 2px rgba(var(--primary-rgb), 0.3))" : "none"}
                      />
                      
                      {/* District labels with improved visibility */}
                      <text 
                        x={centroid.x}
                        y={centroid.y}
                        fontSize={hasRiskZone ? "8" : "6"}
                        fontWeight={hasRiskZone ? "500" : "400"}
                        textAnchor="middle"
                        fill={activeDistrict === districtId ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                        className="pointer-events-none transition-all duration-300"
                        style={{
                          textShadow: "0 0 3px rgba(255,255,255,0.8)",
                          opacity: hasRiskZone || activeDistrict === districtId ? 1 : 0.7
                        }}
                      >
                        {districtName}
                      </text>
                      
                      {/* Highlight risk zone districts with subtle glow */}
                      {hasRiskZone && riskStatus === 'alert' && (
                        <circle
                          cx={centroid.x}
                          cy={centroid.y}
                          r="15"
                          fill="none"
                          stroke="rgba(239,68,68,0.2)"
                          strokeWidth="8"
                          className="animate-pulse opacity-30"
                        />
                      )}
                    </g>
                  );
                })}
                
                {/* Risk zone pins with enhanced visual effects */}
                {riskZones.map(zone => (
                  <g 
                    key={zone.id} 
                    transform={`translate(${zone.coordinates.x}, ${zone.coordinates.y})`}
                    className={`cursor-pointer transition-all duration-300 ${selectedZone === zone.id ? 'scale-125' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      handlePinClick(zone.id);
                    }}
                  >
                    {/* Drop shadow for pins */}
                    <circle 
                      r="5" 
                      fill="rgba(0,0,0,0.2)"
                      cx="1"
                      cy="1"
                      filter="blur(1px)"
                      className="opacity-50"
                    />
                    
                    {/* Main pin circle */}
                    <circle 
                      r="3.5" 
                      fill={
                        zone.status === 'alert' ? 'rgb(239, 68, 68)' : 
                        zone.status === 'escalating' ? 'rgb(245, 158, 11)' : 
                        'rgb(34, 197, 94)'
                      } 
                      stroke="white" 
                      strokeWidth="1.2"
                      className={`${zone.status === 'alert' ? 'animate-pulse' : ''}`}
                      filter="drop-shadow(0 1px 1px rgba(0,0,0,0.1))"
                    />
                    
                    {/* Outer glow */}
                    <circle 
                      r="7" 
                      fill={
                        zone.status === 'alert' ? 'rgba(239, 68, 68, 0.3)' : 
                        zone.status === 'escalating' ? 'rgba(245, 158, 11, 0.3)' : 
                        'rgba(34, 197, 94, 0.3)'
                      } 
                      stroke="transparent" 
                      className={`${zone.status === 'alert' ? 'animate-pulse' : ''}`}
                    />
                    
                    {/* Ripple effect for alert zones */}
                    {zone.status === 'alert' && (
                      <circle 
                        r="10" 
                        fill="none"
                        stroke="rgba(239, 68, 68, 0.4)"
                        strokeWidth="1"
                        className="animate-ping opacity-75"
                      />
                    )}
                    
                    {/* Enhanced tooltip with shadow */}
                    {selectedZone === zone.id && (
                      <foreignObject x="-60" y="7" width="120" height="50">
                        <div className="bg-background/95 border shadow-lg rounded-md p-2 text-xs animate-fade-in">
                          <p className="font-medium">{zone.name}</p>
                          <p className="text-muted-foreground text-[10px] mt-0.5">{zone.description}</p>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                ))}
                
                {/* District connections - subtle network lines between risk zones */}
                <g className="opacity-20">
                  {riskZones.slice(0, -1).map((zone, index) => {
                    const nextZone = riskZones[index + 1];
                    return (
                      <path 
                        key={`connection-${zone.id}-${nextZone.id}`}
                        d={`M${zone.coordinates.x},${zone.coordinates.y} L${nextZone.coordinates.x},${nextZone.coordinates.y}`}
                        stroke="#94a3b8" 
                        strokeWidth="1" 
                        strokeDasharray="2,2"
                      />
                    );
                  })}
                </g>
                
                {/* Improved compass rose */}
                <g transform="translate(40, 50)" className="opacity-70">
                  <circle r="15" fill="rgba(255,255,255,0.7)" stroke="#94a3b8" strokeWidth="0.5" className="dark:fill-slate-800" />
                  <path d="M0,-15 L0,15 M-15,0 L15,0" stroke="#94a3b8" strokeWidth="0.5" />
                  <path d="M0,-15 L2,-8 L0,-10 L-2,-8 Z" fill="#64748b" />
                  <text x="0" y="-17" fontSize="6" textAnchor="middle" fill="#64748b">N</text>
                  <text x="17" y="0" fontSize="6" textAnchor="middle" fill="#64748b" dominantBaseline="middle">E</text>
                  <text x="0" y="19" fontSize="6" textAnchor="middle" fill="#64748b">S</text>
                  <text x="-17" y="0" fontSize="6" textAnchor="middle" fill="#64748b" dominantBaseline="middle">W</text>
                </g>
                
                {/* Improved scale indicator */}
                <g transform="translate(40, 450)">
                  <rect x="0" y="-5" width="100" height="10" fill="rgba(255,255,255,0.7)" rx="2" className="dark:fill-slate-800/50" />
                  <line x1="0" y1="0" x2="100" y2="0" stroke="#64748b" strokeWidth="1" />
                  <line x1="0" y1="-3" x2="0" y2="3" stroke="#64748b" strokeWidth="1" />
                  <line x1="50" y1="-2" x2="50" y2="2" stroke="#64748b" strokeWidth="1" />
                  <line x1="100" y1="-3" x2="100" y2="3" stroke="#64748b" strokeWidth="1" />
                  <text x="50" y="8" fontSize="6" textAnchor="middle" fill="#64748b">100 km</text>
                </g>
                
                {/* District count badge */}
                <g transform="translate(450, 450)">
                  <rect x="-60" y="-12" width="60" height="16" fill="rgba(255,255,255,0.8)" rx="4" className="dark:fill-slate-800/80" />
                  <text x="-30" y="0" fontSize="8" textAnchor="middle" dominantBaseline="middle" fill="hsl(var(--foreground))">
                    <tspan className="font-medium">{riskZoneDistrictIds.length}</tspan>
                    <tspan dx="2" className="text-muted-foreground"> / </tspan>
                    <tspan dx="2" className="text-muted-foreground">{getAllDistrictIds().length}</tspan>
                  </text>
                </g>
                
                {/* Map legend box */}
                <g transform="translate(450, 40)">
                  <rect x="-80" y="0" width="70" height="62" fill="rgba(255,255,255,0.8)" rx="4" stroke="rgba(203,213,225,0.8)" strokeWidth="1" className="dark:fill-slate-800/80" />
                  <text x="-45" y="12" fontSize="6" textAnchor="middle" fill="hsl(var(--foreground))">Status Legend</text>
                  <line x1="-75" y1="18" x2="-15" y2="18" stroke="rgba(203,213,225,0.8)" strokeWidth="0.5" />
                  
                  <circle cx="-70" cy="28" r="3" fill="rgb(239, 68, 68)" stroke="white" strokeWidth="0.5" />
                  <text x="-64" y="30" fontSize="6" textAnchor="start" fill="hsl(var(--foreground))">Alert</text>
                  
                  <circle cx="-70" cy="41" r="3" fill="rgb(245, 158, 11)" stroke="white" strokeWidth="0.5" />
                  <text x="-64" y="43" fontSize="6" textAnchor="start" fill="hsl(var(--foreground))">Escalating</text>
                  
                  <circle cx="-70" cy="54" r="3" fill="rgb(34, 197, 94)" stroke="white" strokeWidth="0.5" />
                  <text x="-64" y="56" fontSize="6" textAnchor="start" fill="hsl(var(--foreground))">Stable</text>
                </g>
              </svg>
            </div>
          </div>
          
          {/* Pan indicator when dragging */}
          {isDragging && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/50 rounded-full p-1 shadow-md">
              <Move className="h-6 w-6 text-primary animate-pulse" />
            </div>
          )}
        </div>

        <ScrollArea className="h-[170px]">
          <div className="space-y-4 pr-4">
            {/* Show selected zone details if selected, otherwise show default details */}
            {selectedZoneDetails ? (
              <div className={`border rounded-md p-3 ${
                selectedZoneDetails.status === 'alert' ? 'bg-red-50 dark:bg-red-950/30' :
                selectedZoneDetails.status === 'escalating' ? 'bg-amber-50 dark:bg-amber-950/30' :
                'bg-green-50 dark:bg-green-950/30'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{selectedZoneDetails.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedZoneDetails.description}</p>
                  </div>
                  <Badge variant={
                    selectedZoneDetails.status === 'alert' ? 'destructive' :
                    selectedZoneDetails.status === 'escalating' ? 'secondary' :
                    'outline'
                  } className={
                    selectedZoneDetails.status === 'escalating' ? 'bg-amber-500 hover:bg-amber-600' :
                    selectedZoneDetails.status === 'stable' ? 'border-green-500 text-green-700 dark:text-green-400' :
                    ''
                  }>
                    {selectedZoneDetails.status === 'alert' ? 'Alert' :
                    selectedZoneDetails.status === 'escalating' ? 'Escalating' : 'Stable'}
                  </Badge>
                </div>
                <p className="text-xs mt-2">
                  <strong>Recommendation:</strong> {selectedZoneDetails.recommendation}
                </p>
              </div>
            ) : (
              // Default risk zones display
              riskZones.filter(zone => zone.status === 'alert' || zone.status === 'escalating')
                .slice(0, 2)
                .map(zone => (
                  <div 
                    key={zone.id}
                    className={`border rounded-md p-3 ${
                      zone.status === 'alert' ? 'bg-red-50 dark:bg-red-950/30' :
                      zone.status === 'escalating' ? 'bg-amber-50 dark:bg-amber-950/30' :
                      'bg-green-50 dark:bg-green-950/30'
                    } cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => handlePinClick(zone.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{zone.name}</h4>
                        <p className="text-sm text-muted-foreground">{zone.description}</p>
                      </div>
                      <Badge variant={
                        zone.status === 'alert' ? 'destructive' :
                        zone.status === 'escalating' ? 'secondary' :
                        'outline'
                      } className={
                        zone.status === 'escalating' ? 'bg-amber-500 hover:bg-amber-600' :
                        zone.status === 'stable' ? 'border-green-500 text-green-700 dark:text-green-400' :
                        ''
                      }>
                        {zone.status === 'alert' ? 'Alert' :
                        zone.status === 'escalating' ? 'Escalating' : 'Stable'}
                      </Badge>
                    </div>
                    <p className="text-xs mt-2">
                      <strong>Recommendation:</strong> {zone.recommendation}
                    </p>
                  </div>
                ))
            )}

            {/* Legend with improved styling */}
            <div className="border rounded-md p-2 bg-background/50">
              <div className="text-xs flex flex-wrap gap-3">
                <div className="flex items-center gap-1">
                  <CircleDot className="h-3 w-3 text-red-500" />
                  <span>Alert</span>
                </div>
                <div className="flex items-center gap-1">
                  <CircleDot className="h-3 w-3 text-amber-500" />
                  <span>Escalating</span>
                </div>
                <div className="flex items-center gap-1">
                  <CircleDot className="h-3 w-3 text-green-500" />
                  <span>Stable</span>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <MapPin className="h-3 w-3" />
                  <span>{riskZones.length} Active Sites</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HighRiskZoneMap;
