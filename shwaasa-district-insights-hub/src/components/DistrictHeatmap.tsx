// import React, { useState, useEffect, useRef } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Slider } from '@/components/ui/slider';
// import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import { useQuery } from '@tanstack/react-query';
// import { fetchDistrictData } from '@/services/dashboardService';
// import { Calendar, Filter, MapPin, Navigation, Info, AlertTriangle, TrendingUp } from 'lucide-react';

// // Standardized disease color palette
// const DISEASE_COLORS = {
//   tb: {
//     light: 'rgba(249, 115, 22, 0.7)', // Orange
//     gradient: 'from-orange-500/70 to-orange-600/70'
//   },
//   copd: {
//     light: 'rgba(59, 130, 246, 0.7)', // Blue
//     gradient: 'from-blue-500/70 to-blue-600/70'
//   },
//   pneumonia: {
//     light: 'rgba(239, 68, 68, 0.7)', // Red
//     gradient: 'from-red-500/70 to-red-600/70'
//   },
//   fibrosis: {
//     light: 'rgba(139, 92, 246, 0.7)', // Purple
//     gradient: 'from-purple-500/70 to-purple-600/70'
//   },
//   all: {
//     high: 'rgba(239, 68, 68, 0.7)', // Red
//     medium: 'rgba(245, 158, 11, 0.7)', // Amber
//     low: 'rgba(34, 197, 94, 0.7)', // Green
//   }
// };

// // Define consistent risk level colors that match the legend exactly
// const RISK_LEVEL_COLORS = {
//   high: 'rgba(239, 68, 68, 0.7)', // Red
//   medium: 'rgba(245, 158, 11, 0.7)', // Amber
//   low: 'rgba(34, 197, 94, 0.7)' // Green
// };

// // Time range options
// const TIME_RANGES = [
//   { id: '7d', label: 'Last 7 Days' },
//   { id: '30d', label: 'Last 30 Days' },
//   { id: '90d', label: 'Last 90 Days' },
//   { id: 'custom', label: 'Custom Range' }
// ];

// const DistrictHeatmap = () => {
//   const [activeDisease, setActiveDisease] = useState('all');
//   const [timeRange, setTimeRange] = useState('7d');
//   const [customDays, setCustomDays] = useState(15);
//   const [hoverInfo, setHoverInfo] = useState<{ district: string; cases: number } | null>(null);
//   const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
//   const mapRef = useRef<HTMLDivElement>(null);

//   const { data: districtData = [], isLoading } = useQuery({
//     queryKey: ['districtData', activeDisease, timeRange, customDays],
//     queryFn: () => fetchDistrictData(activeDisease),
//   });

//   // Ensure districts is always an array to prevent the "reduce is not a function" error
//   // const districts = Array.isArray(districtData) ? districtData : [];
//   const districts = Array.isArray(districtData)
//   ? districtData.map((d) => ({
//       ...d,
//       total:
//         (d.tb || 0) +
//         (d.copd || 0) +
//         (d.pneumonia || 0) +
//         (d.fibrosis || 0),
//     }))
//   : [];


//   // Calculate summary stats with guard against non-array data
//   const summaryStats = {
//     totalDistricts: districts.length,
//     totalCases: districts.reduce((sum, district) => 
//       sum + (activeDisease === 'all' ? district.total : district[activeDisease as keyof typeof district] as number), 0),
//     flaggedZones: districts.filter(d => d.riskLevel === 'high').length,
//     avgConfidence: 0// Placeholder for now
//   };

//   useEffect(() => {
//     if (!mapRef.current) return;
    
//     // Clear existing map content
//     mapRef.current.innerHTML = '';
    
//     // Create SVG for the Telangana map
//     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//     svg.setAttribute('viewBox', '0 0 500 500');
//     svg.setAttribute('width', '100%');
//     svg.setAttribute('height', '100%');
    
//     // Geographically accurate paths for Telangana's 33 districts with centers
//     const districtPaths: Record<string, { path: string, name: string, center: {x: number, y: number} }> = {
//       adilabad: {
//         path: 'M210,40 L250,35 L265,50 L270,90 L250,110 L220,105 L190,80 L210,40',
//         name: 'Adilabad',
//         center: {x: 230, y: 70}
//       },
//       bhadradri: {
//         path: 'M280,295 L310,290 L330,310 L325,340 L295,345 L280,325 L280,295',
//         name: 'Bhadradri Kothagudem',
//         center: {x: 305, y: 315}
//       },
//       hanumakonda: {
//         path: 'M195,225 L215,215 L230,225 L225,245 L205,250 L195,225',
//         name: 'Hanumakonda',
//         center: {x: 215, y: 230}
//       },
//       hyderabad: {
//         path: 'M130,245 L145,235 L155,255 L140,270 L125,265 L130,245',
//         name: 'Hyderabad',
//         center: {x: 140, y: 255}
//       },
//       jagtial: {
//         path: 'M190,130 L210,120 L225,135 L215,160 L195,170 L175,160 L190,130',
//         name: 'Jagtial',
//         center: {x: 200, y: 145}
//       },
//       jangaon: {
//         path: 'M170,225 L190,230 L195,245 L175,260 L155,255 L160,235 L170,225',
//         name: 'Jangaon',
//         center: {x: 175, y: 240}
//       },
//       jayashankar: {
//         path: 'M160,195 L185,190 L190,215 L170,220 L155,210 L160,195',
//         name: 'Jayashankar Bhupalpally',
//         center: {x: 170, y: 205}
//       },
//       jogulamba: {
//         path: 'M70,330 L90,340 L85,365 L60,360 L50,340 L70,330',
//         name: 'Jogulamba Gadwal',
//         center: {x: 70, y: 345}
//       },
//       kamareddy: {
//         path: 'M120,140 L145,130 L155,155 L140,180 L110,175 L105,155 L120,140',
//         name: 'Kamareddy',
//         center: {x: 130, y: 155}
//       },
//       karimnagar: {
//         path: 'M175,160 L195,150 L210,170 L200,190 L180,195 L165,180 L175,160',
//         name: 'Karimnagar',
//         center: {x: 190, y: 175}
//       },
//       khammam: {
//         path: 'M240,275 L265,265 L285,275 L290,295 L265,315 L245,310 L240,275',
//         name: 'Khammam',
//         center: {x: 265, y: 290}
//       },
//       kumuram: {
//         path: 'M240,40 L270,35 L285,55 L275,80 L250,75 L235,60 L240,40',
//         name: 'Kumuram Bheem',
//         center: {x: 260, y: 55}
//       },
//       mahabubabad: {
//         path: 'M190,245 L210,240 L215,265 L195,270 L185,255 L190,245',
//         name: 'Mahabubabad',
//         center: {x: 200, y: 255}
//       },
//       mahabubnagar: {
//         path: 'M95,290 L120,300 L115,330 L90,340 L70,330 L80,300 L95,290',
//         name: 'Mahabubnagar',
//         center: {x: 95, y: 315}
//       },
//       mancherial: {
//         path: 'M230,90 L260,80 L265,105 L240,115 L225,110 L230,90',
//         name: 'Mancherial',
//         center: {x: 245, y: 100}
//       },
//       medak: {
//         path: 'M100,200 L125,195 L135,215 L120,235 L95,225 L100,200',
//         name: 'Medak',
//         center: {x: 115, y: 215}
//       },
//       medchal: {
//         path: 'M125,240 L140,235 L150,255 L135,270 L120,265 L125,240',
//         name: 'Medchal-Malkajgiri',
//         center: {x: 135, y: 250}
//       },
//       mulugu: {
//         path: 'M165,210 L185,205 L190,235 L175,240 L160,230 L165,210',
//         name: 'Mulugu',
//         center: {x: 175, y: 225}
//       },
//       nagarkurnool: {
//         path: 'M105,300 L130,295 L140,315 L125,335 L105,330 L105,300',
//         name: 'Nagarkurnool',
//         center: {x: 120, y: 315}
//       },
//       nalgonda: {
//         path: 'M160,275 L185,265 L205,280 L200,305 L175,315 L155,300 L160,275',
//         name: 'Nalgonda',
//         center: {x: 180, y: 290}
//       },
//       narayanpet: {
//         path: 'M85,330 L105,325 L110,350 L90,360 L75,345 L85,330',
//         name: 'Narayanpet',
//         center: {x: 95, y: 340}
//       },
//       nirmal: {
//         path: 'M185,80 L215,75 L225,105 L205,120 L180,115 L175,95 L185,80',
//         name: 'Nirmal',
//         center: {x: 200, y: 100}
//       },
//       nizamabad: {
//         path: 'M140,120 L170,110 L180,140 L160,165 L135,160 L125,140 L140,120',
//         name: 'Nizamabad',
//         center: {x: 150, y: 140}
//       },
//       peddapalli: {
//         path: 'M190,150 L220,140 L235,155 L225,175 L200,180 L190,165 L190,150',
//         name: 'Peddapalli',
//         center: {x: 210, y: 160}
//       },
//       rajanna: {
//         path: 'M175,160 L195,155 L210,170 L195,185 L175,180 L175,160',
//         name: 'Rajanna Sircilla',
//         center: {x: 190, y: 170}
//       },
//       rangareddy: {
//         path: 'M120,255 L140,245 L155,265 L140,285 L115,280 L120,255',
//         name: 'Ranga Reddy',
//         center: {x: 135, y: 265}
//       },
//       sangareddy: {
//         path: 'M85,190 L110,180 L120,200 L105,225 L85,220 L75,205 L85,190',
//         name: 'Sangareddy',
//         center: {x: 95, y: 205}
//       },
//       siddipet: {
//         path: 'M130,190 L155,180 L170,195 L160,215 L140,220 L130,200 L130,190',
//         name: 'Siddipet',
//         center: {x: 145, y: 200}
//       },
//       suryapet: {
//         path: 'M195,260 L220,250 L235,265 L230,290 L205,300 L190,280 L195,260',
//         name: 'Suryapet',
//         center: {x: 210, y: 275}
//       },
//       vikarabad: {
//         path: 'M85,235 L105,225 L115,245 L95,265 L75,255 L85,235',
//         name: 'Vikarabad',
//         center: {x: 95, y: 245}
//       },
//       wanaparthy: {
//         path: 'M95,305 L115,300 L120,325 L100,335 L90,320 L95,305',
//         name: 'Wanaparthy',
//         center: {x: 105, y: 320}
//       },
//       warangal: {
//         path: 'M185,205 L205,195 L220,205 L215,225 L195,230 L185,215 L185,205',
//         name: 'Warangal',
//         center: {x: 200, y: 210}
//       },
//       yadadri: {
//         path: 'M155,255 L175,245 L190,260 L185,280 L165,285 L150,275 L155,255',
//         name: 'Yadadri Bhuvanagiri',
//         center: {x: 170, y: 265}
//       }
//     };
    
//     // Add districts to the map with standardized coloring based on risk level
//     Object.entries(districtPaths).forEach(([id, district]) => {
//       const districtData = districts.find(d => d.id === id) || {
//         id,
//         name: district.name,
//         total: 0,
//         tb: 0,
//         copd: 0,
//         pneumonia: 0,
//         fibrosis: 0,
//         riskLevel: 'low'
//       };
      
//       const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//       path.setAttribute('d', district.path);
      
//       // Standardized color based on disease or risk level
//       let fillColor = '#e5e7eb'; // Default gray
      
//       if (activeDisease === 'all') {
//         // Always use risk level colors that match the legend circles
//         fillColor = RISK_LEVEL_COLORS[districtData.riskLevel as keyof typeof RISK_LEVEL_COLORS] || '#e5e7eb';
//       } else {
//         // Use disease-specific colors when a disease is selected
//         const diseaseColor = DISEASE_COLORS[activeDisease as keyof typeof DISEASE_COLORS];
//         if ('light' in diseaseColor) {
//           fillColor = diseaseColor.light;
//         } else {
//           // Fallback for unknown disease type
//           fillColor = '#e5e7eb';
//         }
//       }
      
//       path.setAttribute('fill', fillColor);
//       path.setAttribute('stroke', id === selectedDistrict ? 'hsl(var(--primary))' : '#ffffff');
//       path.setAttribute('stroke-width', id === selectedDistrict ? '3' : '2');
//       path.setAttribute('class', 'transition-colors duration-300 cursor-pointer hover:stroke-primary hover:stroke-[3]');
      
//       // Add district name as text
//       const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
//       text.setAttribute('x', district.center.x.toString());
//       text.setAttribute('y', district.center.y.toString());
//       text.setAttribute('text-anchor', 'middle');
//       text.setAttribute('fill', 'white');
//       text.setAttribute('font-size', '10px');
//       text.setAttribute('font-weight', 'bold');
//       text.setAttribute('pointer-events', 'none');
//       text.textContent = district.name;
      
//       // Interaction events
//       path.addEventListener('mouseover', () => {
//         setHoverInfo({ 
//           district: districtData.name, 
//           cases: activeDisease === 'all' ? districtData.total : districtData[activeDisease as keyof typeof districtData] as number 
//         });
//         path.setAttribute('stroke-width', '3');
//         path.setAttribute('stroke', 'hsl(var(--primary))');
//       });
      
//       path.addEventListener('mouseout', () => {
//         if (id !== selectedDistrict) {
//           setHoverInfo(null);
//           path.setAttribute('stroke-width', '2');
//           path.setAttribute('stroke', '#ffffff');
//         }
//       });

//       path.addEventListener('click', () => {
//         if (selectedDistrict === id) {
//           setSelectedDistrict(null);
//           path.setAttribute('stroke-width', '2');
//           path.setAttribute('stroke', '#ffffff');
//         } else {
//           setSelectedDistrict(id);
//           path.setAttribute('stroke-width', '3');
//           path.setAttribute('stroke', 'hsl(var(--primary))');
//         }
//       });
      
//       svg.appendChild(path);
//       svg.appendChild(text);
//     });
    
//     // Add the SVG to the map container
//     mapRef.current.appendChild(svg);
    
//   }, [districts, activeDisease, selectedDistrict]);

//   return (
//     <Card className="dashboard-card col-span-12 border-2 border-border/30 overflow-hidden shadow-lg">
//       <CardHeader className="flex flex-row items-start justify-between pb-2 bg-gradient-to-r from-background to-muted/30">
//         <div>
//           <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
//             Telangana District Disease Load Heatmap
//           </CardTitle>
//           <p className="text-sm text-muted-foreground">District-level visualization of disease distribution across Telangana</p>
//         </div>
//         <Tabs defaultValue="7d" value={timeRange} onValueChange={setTimeRange} className="w-auto">
//           <TabsList>
//             <TabsTrigger value="7d">7 Days</TabsTrigger>
//             <TabsTrigger value="30d">30 Days</TabsTrigger>
//             <TabsTrigger value="90d">90 Days</TabsTrigger>
//             <TabsTrigger value="custom">Custom</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </CardHeader>
//       <CardContent className="p-4 bg-gradient-to-br from-background to-muted/30">
//         {/* Summary Stats Section */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
//           <div className="bg-background/80 p-3 rounded-md border shadow-sm">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <MapPin className="h-4 w-4" />
//               <span className="text-xs">Total Districts</span>
//             </div>
//             <span className="text-xl font-semibold">{summaryStats.totalDistricts}</span>
//           </div>
//           <div className="bg-background/80 p-3 rounded-md border shadow-sm">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <TrendingUp className="h-4 w-4" />
//               <span className="text-xs">Total Cases</span>
//             </div>
//             <span className="text-xl font-semibold">{summaryStats.totalCases.toLocaleString()}</span>
//           </div>
//           <div className="bg-background/80 p-3 rounded-md border shadow-sm">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <AlertTriangle className="h-4 w-4" />
//               <span className="text-xs">Flagged Zones</span>
//             </div>
//             <span className="text-xl font-semibold">{summaryStats.flaggedZones}</span>
//           </div>
//           <div className="bg-background/80 p-3 rounded-md border shadow-sm">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <Info className="h-4 w-4" />
//               <span className="text-xs">Avg AI Confidence</span>
//             </div>
//             <span className="text-xl font-semibold">{summaryStats.avgConfidence}%</span>
//           </div>
//         </div>
        
//         {/* Controls Section */}
//         <div className="mb-4">
//           <div className="flex flex-wrap gap-2 mb-3">
//             <div className="flex-1">
//               <Button 
//                 variant={activeDisease === 'all' ? 'default' : 'outline'} 
//                 size="sm" 
//                 onClick={() => setActiveDisease('all')}
//                 className="shadow-sm"
//               >
//                 <Filter className="h-4 w-4 mr-1" />
//                 All Diseases
//               </Button>
//             </div>
//             <div className="flex flex-wrap gap-2 flex-1 md:flex-[2]">
//               <Button 
//                 variant={activeDisease === 'tb' ? 'default' : 'outline'} 
//                 size="sm" 
//                 onClick={() => setActiveDisease('tb')}
//                 className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white shadow-sm ${activeDisease === 'tb' ? 'bg-orange-600 text-white' : ''}`}
//               >
//                 Tuberculosis
//               </Button>
//               <Button 
//                 variant={activeDisease === 'copd' ? 'default' : 'outline'} 
//                 size="sm" 
//                 onClick={() => setActiveDisease('copd')}
//                 className={`border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm ${activeDisease === 'copd' ? 'bg-blue-600 text-white' : ''}`}
//               >
//                 COPD
//               </Button>
//               <Button 
//                 variant={activeDisease === 'fibrosis' ? 'default' : 'outline'} 
//                 size="sm" 
//                 onClick={() => setActiveDisease('fibrosis')}
//                 className={`border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white shadow-sm ${activeDisease === 'fibrosis' ? 'bg-purple-600 text-white' : ''}`}
//               >
//                 Fibrosis
//               </Button>
//               <Button 
//                 variant={activeDisease === 'pneumonia' ? 'default' : 'outline'} 
//                 size="sm" 
//                 onClick={() => setActiveDisease('pneumonia')}
//                 className={`border-red-600 text-red-600 hover:bg-red-600 hover:text-white shadow-sm ${activeDisease === 'pneumonia' ? 'bg-red-600 text-white' : ''}`}
//               >
//                 Pneumonia
//               </Button>
//             </div>
//           </div>
          
//           {/* Custom date range slider */}
//           {timeRange === 'custom' && (
//             <div className="bg-background/50 p-3 rounded-md border mb-3">
//               <div className="flex items-center justify-between mb-2">
//                 <label className="text-sm font-medium flex items-center gap-1">
//                   <Calendar className="h-4 w-4" />
//                   Custom Days: <span className="font-bold">{customDays}</span>
//                 </label>
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-6 w-6">
//                         <Info className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>Slide to adjust the number of days in your custom date range</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//               </div>
//               <Slider 
//                 value={[customDays]} 
//                 min={1} 
//                 max={180} 
//                 step={1}
//                 onValueChange={(vals) => setCustomDays(vals[0])} 
//                 className="py-4"
//               />
//               <div className="flex justify-between text-xs text-muted-foreground">
//                 <span>1 day</span>
//                 <span>90 days</span>
//                 <span>180 days</span>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="h-[460px] rounded-xl border relative bg-gradient-to-br from-background to-muted flex items-center justify-center shadow-inner overflow-hidden">
//           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_70%)]"></div>
//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center h-full">
//               <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
//               <p className="mt-4 text-muted-foreground">Loading map data...</p>
//             </div>
//           ) : (
//             <div 
//               ref={mapRef} 
//               className="w-full h-full p-4 relative"
//             ></div>
//           )}
          
//           <div className="absolute bottom-4 right-4 bg-background/90 p-3 rounded-md border shadow-lg backdrop-blur-sm">
//             <h4 className="font-medium flex items-center gap-2">
//               <Navigation className="h-4 w-4" /> Telangana Districts
//             </h4>
//             <ul className="mt-1 space-y-1 max-h-[200px] overflow-auto pr-2 scrollbar-thin">
//               {districts.map(district => (
//                 <li 
//                   key={district.id} 
//                   className={`flex justify-between gap-4 p-1 rounded cursor-pointer ${
//                     selectedDistrict === district.id ? 'bg-primary/20' : 'hover:bg-muted/50'
//                   }`}
//                   onClick={() => setSelectedDistrict(selectedDistrict === district.id ? null : district.id)}
//                 >
//                   <span className="flex items-center gap-1">
//                     <MapPin className="h-3 w-3" /> {district.name}
//                   </span>
//                   <span className="font-medium">{activeDisease === 'all' ? district.total : district[activeDisease as keyof typeof district]} cases</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
          
//           {hoverInfo && (
//             <div className="absolute top-4 left-4 bg-background/90 border rounded-md shadow-lg p-3 animate-fade-in backdrop-blur-sm">
//               <h4 className="font-medium">{hoverInfo.district}</h4>
//               <p className="text-sm">
//                 <span className="font-medium">{hoverInfo.cases.toLocaleString()}</span> 
//                 {activeDisease === 'all' ? ' total' : ` ${activeDisease}`} cases detected
//               </p>
//               <div className={`h-1 w-full mt-1 rounded-full bg-gradient-to-r ${activeDisease === 'all' ? 'from-green-500 to-red-500' : 
//                 activeDisease === 'tb' ? DISEASE_COLORS.tb.gradient :
//                 activeDisease === 'copd' ? DISEASE_COLORS.copd.gradient :
//                 activeDisease === 'pneumonia' ? DISEASE_COLORS.pneumonia.gradient :
//                 activeDisease === 'fibrosis' ? DISEASE_COLORS.fibrosis.gradient : ''
//               }`}></div>
//             </div>
//           )}
          
//           <div className="absolute top-4 right-4 bg-background/90 p-3 rounded-md border shadow-lg backdrop-blur-sm">
//             <div className="flex items-center gap-1 mb-2">
//               <span className="text-sm font-medium">Risk Level Legend:</span>
//             </div>
//             <div className="grid grid-cols-3 gap-2">
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-red-500/70 rounded-full"></div>
//                 <span className="text-xs">High</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-amber-500/70 rounded-full"></div>
//                 <span className="text-xs">Medium</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-green-500/70 rounded-full"></div>
//                 <span className="text-xs">Low</span>
//               </div>
//             </div>
//             <div className="mt-2 pt-2 border-t border-border/50">
//               <span className="text-sm font-medium">Disease Colors:</span>
//               <div className="grid grid-cols-2 gap-2 mt-1">
//                 <div className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-orange-500/70 rounded-full"></div>
//                   <span className="text-xs">TB</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-blue-500/70 rounded-full"></div>
//                   <span className="text-xs">COPD</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-purple-500/70 rounded-full"></div>
//                   <span className="text-xs">Fibrosis</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-red-500/70 rounded-full"></div>
//                   <span className="text-xs">Pneumonia</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default DistrictHeatmap;





// import React, { useState, useEffect, useRef } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Slider } from '@/components/ui/slider';
// import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import { useQuery } from '@tanstack/react-query';
// import { fetchDistrictData } from '@/services/dashboardService';
// import { Calendar, Filter, MapPin, Navigation, Info, AlertTriangle, TrendingUp } from 'lucide-react';

// // Standardized disease color palette
// const DISEASE_COLORS = {
//   tb: {
//     light: 'rgba(249, 115, 22, 0.7)', // Orange
//     gradient: 'from-orange-500/70 to-orange-600/70'
//   },
//   copd: {
//     light: 'rgba(59, 130, 246, 0.7)', // Blue
//     gradient: 'from-blue-500/70 to-blue-600/70'
//   },
//   pneumonia: {
//     light: 'rgba(239, 68, 68, 0.7)', // Red
//     gradient: 'from-red-500/70 to-red-600/70'
//   },
//   fibrosis: {
//     light: 'rgba(139, 92, 246, 0.7)', // Purple
//     gradient: 'from-purple-500/70 to-purple-600/70'
//   },
//   all: {
//     high: 'rgba(239, 68, 68, 0.7)', // Red
//     medium: 'rgba(245, 158, 11, 0.7)', // Amber
//     low: 'rgba(34, 197, 94, 0.7)', // Green
//   }
// };

// // Define consistent risk level colors that match the legend exactly
// const RISK_LEVEL_COLORS = {
//   high: 'rgba(239, 68, 68, 0.7)', // Red
//   medium: 'rgba(245, 158, 11, 0.7)', // Amber
//   low: 'rgba(34, 197, 94, 0.7)' // Green
// };

// // Time range options
// const TIME_RANGES = [
//   { id: '7d', label: 'Last 7 Days' },
//   { id: '30d', label: 'Last 30 Days' },
//   { id: '90d', label: 'Last 90 Days' },
//   { id: 'custom', label: 'Custom Range' }
// ];

// const DistrictHeatmap = () => {
//   const [activeDisease, setActiveDisease] = useState('all');
//   const [timeRange, setTimeRange] = useState('7d');
//   const [customDays, setCustomDays] = useState(15);
//   const [hoverInfo, setHoverInfo] = useState<{ district: string; cases: number } | null>(null);
//   const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
//   const mapRef = useRef<HTMLDivElement>(null);

//   const { data: districtData = [], isLoading } = useQuery({
//     queryKey: ['districtData', activeDisease, timeRange, customDays],
//     queryFn: () => fetchDistrictData(activeDisease),
//   });

//   // Ensure districts is always an array to prevent the "reduce is not a function" error
//   const districts = Array.isArray(districtData) ? districtData : [];

//   // Calculate summary stats with guard against non-array data
//   const summaryStats = {
//     totalDistricts: districts.length,
//     totalCases: districts.reduce((sum, district) => 
//       sum + (activeDisease === 'all' ? district.total : district[activeDisease as keyof typeof district] as number), 0),
//     flaggedZones: districts.filter(d => d.riskLevel === 'high').length,
//     avgConfidence: 94.3 // Placeholder for now
//   };

//   useEffect(() => {
//     if (!mapRef.current) return;
    
//     // Clear existing map content
//     mapRef.current.innerHTML = '';
    
//     // Create SVG for the Telangana map
//     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//     svg.setAttribute('viewBox', '0 0 500 500');
//     svg.setAttribute('width', '100%');
//     svg.setAttribute('height', '100%');
    
//     // Geographically accurate paths for Telangana's 33 districts with centers
//     const districtPaths: Record<string, { path: string, name: string, center: {x: number, y: number} }> = {
//       adilabad: {
//         path: 'M210,40 L250,35 L265,50 L270,90 L250,110 L220,105 L190,80 L210,40',
//         name: 'Adilabad',
//         center: {x: 230, y: 70}
//       },
//       bhadradri: {
//         path: 'M280,295 L310,290 L330,310 L325,340 L295,345 L280,325 L280,295',
//         name: 'Bhadradri Kothagudem',
//         center: {x: 305, y: 315}
//       },
//       hanumakonda: {
//         path: 'M195,225 L215,215 L230,225 L225,245 L205,250 L195,225',
//         name: 'Hanumakonda',
//         center: {x: 215, y: 230}
//       },
//       hyderabad: {
//         path: 'M130,245 L145,235 L155,255 L140,270 L125,265 L130,245',
//         name: 'Hyderabad',
//         center: {x: 140, y: 255}
//       },
//       jagtial: {
//         path: 'M190,130 L210,120 L225,135 L215,160 L195,170 L175,160 L190,130',
//         name: 'Jagtial',
//         center: {x: 200, y: 145}
//       },
//       jangaon: {
//         path: 'M170,225 L190,230 L195,245 L175,260 L155,255 L160,235 L170,225',
//         name: 'Jangaon',
//         center: {x: 175, y: 240}
//       },
//       jayashankar: {
//         path: 'M160,195 L185,190 L190,215 L170,220 L155,210 L160,195',
//         name: 'Jayashankar Bhupalpally',
//         center: {x: 170, y: 205}
//       },
//       jogulamba: {
//         path: 'M70,330 L90,340 L85,365 L60,360 L50,340 L70,330',
//         name: 'Jogulamba Gadwal',
//         center: {x: 70, y: 345}
//       },
//       kamareddy: {
//         path: 'M120,140 L145,130 L155,155 L140,180 L110,175 L105,155 L120,140',
//         name: 'Kamareddy',
//         center: {x: 130, y: 155}
//       },
//       karimnagar: {
//         path: 'M175,160 L195,150 L210,170 L200,190 L180,195 L165,180 L175,160',
//         name: 'Karimnagar',
//         center: {x: 190, y: 175}
//       },
//       khammam: {
//         path: 'M240,275 L265,265 L285,275 L290,295 L265,315 L245,310 L240,275',
//         name: 'Khammam',
//         center: {x: 265, y: 290}
//       },
//       kumuram: {
//         path: 'M240,40 L270,35 L285,55 L275,80 L250,75 L235,60 L240,40',
//         name: 'Kumuram Bheem',
//         center: {x: 260, y: 55}
//       },
//       mahabubabad: {
//         path: 'M190,245 L210,240 L215,265 L195,270 L185,255 L190,245',
//         name: 'Mahabubabad',
//         center: {x: 200, y: 255}
//       },
//       mahabubnagar: {
//         path: 'M95,290 L120,300 L115,330 L90,340 L70,330 L80,300 L95,290',
//         name: 'Mahabubnagar',
//         center: {x: 95, y: 315}
//       },
//       mancherial: {
//         path: 'M230,90 L260,80 L265,105 L240,115 L225,110 L230,90',
//         name: 'Mancherial',
//         center: {x: 245, y: 100}
//       },
//       medak: {
//         path: 'M100,200 L125,195 L135,215 L120,235 L95,225 L100,200',
//         name: 'Medak',
//         center: {x: 115, y: 215}
//       },
//       medchal: {
//         path: 'M125,240 L140,235 L150,255 L135,270 L120,265 L125,240',
//         name: 'Medchal-Malkajgiri',
//         center: {x: 135, y: 250}
//       },
//       mulugu: {
//         path: 'M165,210 L185,205 L190,235 L175,240 L160,230 L165,210',
//         name: 'Mulugu',
//         center: {x: 175, y: 225}
//       },
//       nagarkurnool: {
//         path: 'M105,300 L130,295 L140,315 L125,335 L105,330 L105,300',
//         name: 'Nagarkurnool',
//         center: {x: 120, y: 315}
//       },
//       nalgonda: {
//         path: 'M160,275 L185,265 L205,280 L200,305 L175,315 L155,300 L160,275',
//         name: 'Nalgonda',
//         center: {x: 180, y: 290}
//       },
//       narayanpet: {
//         path: 'M85,330 L105,325 L110,350 L90,360 L75,345 L85,330',
//         name: 'Narayanpet',
//         center: {x: 95, y: 340}
//       },
//       nirmal: {
//         path: 'M185,80 L215,75 L225,105 L205,120 L180,115 L175,95 L185,80',
//         name: 'Nirmal',
//         center: {x: 200, y: 100}
//       },
//       nizamabad: {
//         path: 'M140,120 L170,110 L180,140 L160,165 L135,160 L125,140 L140,120',
//         name: 'Nizamabad',
//         center: {x: 150, y: 140}
//       },
//       peddapalli: {
//         path: 'M190,150 L220,140 L235,155 L225,175 L200,180 L190,165 L190,150',
//         name: 'Peddapalli',
//         center: {x: 210, y: 160}
//       },
//       rajanna: {
//         path: 'M175,160 L195,155 L210,170 L195,185 L175,180 L175,160',
//         name: 'Rajanna Sircilla',
//         center: {x: 190, y: 170}
//       },
//       rangareddy: {
//         path: 'M120,255 L140,245 L155,265 L140,285 L115,280 L120,255',
//         name: 'Ranga Reddy',
//         center: {x: 135, y: 265}
//       },
//       sangareddy: {
//         path: 'M85,190 L110,180 L120,200 L105,225 L85,220 L75,205 L85,190',
//         name: 'Sangareddy',
//         center: {x: 95, y: 205}
//       },
//       siddipet: {
//         path: 'M130,190 L155,180 L170,195 L160,215 L140,220 L130,200 L130,190',
//         name: 'Siddipet',
//         center: {x: 145, y: 200}
//       },
//       suryapet: {
//         path: 'M195,260 L220,250 L235,265 L230,290 L205,300 L190,280 L195,260',
//         name: 'Suryapet',
//         center: {x: 210, y: 275}
//       },
//       vikarabad: {
//         path: 'M85,235 L105,225 L115,245 L95,265 L75,255 L85,235',
//         name: 'Vikarabad',
//         center: {x: 95, y: 245}
//       },
//       wanaparthy: {
//         path: 'M95,305 L115,300 L120,325 L100,335 L90,320 L95,305',
//         name: 'Wanaparthy',
//         center: {x: 105, y: 320}
//       },
//       warangal: {
//         path: 'M185,205 L205,195 L220,205 L215,225 L195,230 L185,215 L185,205',
//         name: 'Warangal',
//         center: {x: 200, y: 210}
//       },
//       yadadri: {
//         path: 'M155,255 L175,245 L190,260 L185,280 L165,285 L150,275 L155,255',
//         name: 'Yadadri Bhuvanagiri',
//         center: {x: 170, y: 265}
//       }
//     };
    
//     // Add districts to the map with standardized coloring based on risk level
//     Object.entries(districtPaths).forEach(([id, district]) => {
//       const districtData = districts.find(d => d.id === id) || {
//         id,
//         name: district.name,
//         total: 0,
//         tb: 0,
//         copd: 0,
//         pneumonia: 0,
//         fibrosis: 0,
//         riskLevel: 'low'
//       };
      
//       const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//       path.setAttribute('d', district.path);
      
//       // Standardized color based on disease or risk level
//       let fillColor = '#e5e7eb'; // Default gray
      
//       if (activeDisease === 'all') {
//         // Always use risk level colors that match the legend circles
//         fillColor = RISK_LEVEL_COLORS[districtData.riskLevel as keyof typeof RISK_LEVEL_COLORS] || '#e5e7eb';
//       } else {
//         // Use disease-specific colors when a disease is selected
//         const diseaseColor = DISEASE_COLORS[activeDisease as keyof typeof DISEASE_COLORS];
//         if ('light' in diseaseColor) {
//           fillColor = diseaseColor.light;
//         } else {
//           // Fallback for unknown disease type
//           fillColor = '#e5e7eb';
//         }
//       }
      
//       path.setAttribute('fill', fillColor);
//       path.setAttribute('stroke', id === selectedDistrict ? 'hsl(var(--primary))' : '#ffffff');
//       path.setAttribute('stroke-width', id === selectedDistrict ? '3' : '2');
//       path.setAttribute('class', 'transition-colors duration-300 cursor-pointer hover:stroke-primary hover:stroke-[3]');
      
//       // Add district name as text
//       const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
//       text.setAttribute('x', district.center.x.toString());
//       text.setAttribute('y', district.center.y.toString());
//       text.setAttribute('text-anchor', 'middle');
//       text.setAttribute('fill', 'white');
//       text.setAttribute('font-size', '10px');
//       text.setAttribute('font-weight', 'bold');
//       text.setAttribute('pointer-events', 'none');
//       text.textContent = district.name;
      
//       // Interaction events
//       path.addEventListener('mouseover', () => {
//         setHoverInfo({ 
//           district: districtData.name, 
//           cases: activeDisease === 'all' ? districtData.total : districtData[activeDisease as keyof typeof districtData] as number 
//         });
//         path.setAttribute('stroke-width', '3');
//         path.setAttribute('stroke', 'hsl(var(--primary))');
//       });
      
//       path.addEventListener('mouseout', () => {
//         if (id !== selectedDistrict) {
//           setHoverInfo(null);
//           path.setAttribute('stroke-width', '2');
//           path.setAttribute('stroke', '#ffffff');
//         }
//       });

//       path.addEventListener('click', () => {
//         if (selectedDistrict === id) {
//           setSelectedDistrict(null);
//           path.setAttribute('stroke-width', '2');
//           path.setAttribute('stroke', '#ffffff');
//         } else {
//           setSelectedDistrict(id);
//           path.setAttribute('stroke-width', '3');
//           path.setAttribute('stroke', 'hsl(var(--primary))');
//         }
//       });
      
//       svg.appendChild(path);
//       svg.appendChild(text);
//     });
    
//     // Add the SVG to the map container
//     mapRef.current.appendChild(svg);
    
//   }, [districts, activeDisease, selectedDistrict]);

//   return (
//     <Card className="dashboard-card col-span-12 border-2 border-border/30 overflow-hidden shadow-lg">
//       <CardHeader className="flex flex-row items-start justify-between pb-2 bg-gradient-to-r from-background to-muted/30">
//         <div>
//           <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
//             Telangana District Disease Load Heatmap
//           </CardTitle>
//           <p className="text-sm text-muted-foreground">District-level visualization of disease distribution across Telangana</p>
//         </div>
//         <Tabs defaultValue="7d" value={timeRange} onValueChange={setTimeRange} className="w-auto">
//           <TabsList>
//             <TabsTrigger value="7d">7 Days</TabsTrigger>
//             <TabsTrigger value="30d">30 Days</TabsTrigger>
//             <TabsTrigger value="90d">90 Days</TabsTrigger>
//             <TabsTrigger value="custom">Custom</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </CardHeader>
//       <CardContent className="p-4 bg-gradient-to-br from-background to-muted/30">
//         {/* Summary Stats Section */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
//           <div className="bg-background/80 p-3 rounded-md border shadow-sm">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <MapPin className="h-4 w-4" />
//               <span className="text-xs">Total Districts</span>
//             </div>
//             <span className="text-xl font-semibold">{summaryStats.totalDistricts}</span>
//           </div>
//           <div className="bg-background/80 p-3 rounded-md border shadow-sm">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <TrendingUp className="h-4 w-4" />
//               <span className="text-xs">Total Cases</span>
//             </div>
//             <span className="text-xl font-semibold">{summaryStats.totalCases.toLocaleString()}</span>
//           </div>
//           <div className="bg-background/80 p-3 rounded-md border shadow-sm">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <AlertTriangle className="h-4 w-4" />
//               <span className="text-xs">Flagged Zones</span>
//             </div>
//             <span className="text-xl font-semibold">{summaryStats.flaggedZones}</span>
//           </div>
//           <div className="bg-background/80 p-3 rounded-md border shadow-sm">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <Info className="h-4 w-4" />
//               <span className="text-xs">Avg AI Confidence</span>
//             </div>
//             <span className="text-xl font-semibold">{summaryStats.avgConfidence}%</span>
//           </div>
//         </div>
        
//         {/* Controls Section */}
//         <div className="mb-4">
//           <div className="flex flex-wrap gap-2 mb-3">
//             <div className="flex-1">
//               <Button 
//                 variant={activeDisease === 'all' ? 'default' : 'outline'} 
//                 size="sm" 
//                 onClick={() => setActiveDisease('all')}
//                 className="shadow-sm"
//               >
//                 <Filter className="h-4 w-4 mr-1" />
//                 All Diseases
//               </Button>
//             </div>
//             <div className="flex flex-wrap gap-2 flex-1 md:flex-[2]">
//               <Button 
//                 variant={activeDisease === 'tb' ? 'default' : 'outline'} 
//                 size="sm" 
//                 onClick={() => setActiveDisease('tb')}
//                 className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white shadow-sm ${activeDisease === 'tb' ? 'bg-orange-600 text-white' : ''}`}
//               >
//                 Tuberculosis
//               </Button>

//               <Button 
//                 variant={activeDisease === 'copd' ? 'default' : 'outline'} 
//                 size="sm" 
//                 onClick={() => setActiveDisease('copd')}
//                 className={`border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm ${activeDisease === 'copd' ? 'bg-blue-600 text-white' : ''}`}
//               >
//                 COPD
//               </Button>

//               <Button 
//                 variant={activeDisease === 'fibrosis' ? 'default' : 'outline'} 
//                 size="sm" 
//                 onClick={() => setActiveDisease('fibrosis')}
//                 className={`border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white shadow-sm ${activeDisease === 'fibrosis' ? 'bg-purple-600 text-white' : ''}`}
//               >
//                 Fibrosis
//               </Button>

//               <Button 
//                 variant={activeDisease === 'pneumonia' ? 'default' : 'outline'} 
//                 size="sm" 
//                 onClick={() => setActiveDisease('pneumonia')}
//                 className={`border-red-600 text-red-600 hover:bg-red-600 hover:text-white shadow-sm ${activeDisease === 'pneumonia' ? 'bg-red-600 text-white' : ''}`}
//               >
//                 Pneumonia
//               </Button>
//             </div>
//           </div>
          
//           {/* Custom date range slider */}
//           {timeRange === 'custom' && (
//             <div className="bg-background/50 p-3 rounded-md border mb-3">
//               <div className="flex items-center justify-between mb-2">
//                 <label className="text-sm font-medium flex items-center gap-1">
//                   <Calendar className="h-4 w-4" />
//                   Custom Days: <span className="font-bold">{customDays}</span>
//                 </label>
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-6 w-6">
//                         <Info className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>Slide to adjust the number of days in your custom date range</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//               </div>
//               <Slider 
//                 value={[customDays]} 
//                 min={1} 
//                 max={180} 
//                 step={1}
//                 onValueChange={(vals) => setCustomDays(vals[0])} 
//                 className="py-4"
//               />
//               <div className="flex justify-between text-xs text-muted-foreground">
//                 <span>1 day</span>
//                 <span>90 days</span>
//                 <span>180 days</span>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="h-[460px] rounded-xl border relative bg-gradient-to-br from-background to-muted flex items-center justify-center shadow-inner overflow-hidden">
//           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_70%)]"></div>
//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center h-full">
//               <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
//               <p className="mt-4 text-muted-foreground">Loading map data...</p>
//             </div>
//           ) : (
//             <div 
//               ref={mapRef} 
//               className="w-full h-full p-4 relative"
//             ></div>
//           )}
          
//           <div className="absolute bottom-4 right-4 bg-background/90 p-3 rounded-md border shadow-lg backdrop-blur-sm">
//             <h4 className="font-medium flex items-center gap-2">
//               <Navigation className="h-4 w-4" /> Telangana Districts
//             </h4>
//             <ul className="mt-1 space-y-1 max-h-[200px] overflow-auto pr-2 scrollbar-thin">
//               {districts.map(district => (
//                 <li 
//                   key={district.id} 
//                   className={`flex justify-between gap-4 p-1 rounded cursor-pointer ${
//                     selectedDistrict === district.id ? 'bg-primary/20' : 'hover:bg-muted/50'
//                   }`}
//                   onClick={() => setSelectedDistrict(selectedDistrict === district.id ? null : district.id)}
//                 >
//                   <span className="flex items-center gap-1">
//                     <MapPin className="h-3 w-3" /> {district.name}
//                   </span>
//                   <span className="font-medium">{activeDisease === 'all' ? district.total : district[activeDisease as keyof typeof district]} cases</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
          
//           {hoverInfo && (
//             <div className="absolute top-4 left-4 bg-background/90 border rounded-md shadow-lg p-3 animate-fade-in backdrop-blur-sm">
//               <h4 className="font-medium">{hoverInfo.district}</h4>
//               <p className="text-sm">
//                 <span className="font-medium">{hoverInfo.cases.toLocaleString()}</span> 
//                 {activeDisease === 'all' ? ' total' : ` ${activeDisease}`} cases detected
//               </p>
//               <div className={`h-1 w-full mt-1 rounded-full bg-gradient-to-r ${activeDisease === 'all' ? 'from-green-500 to-red-500' : 
//                 activeDisease === 'tb' ? DISEASE_COLORS.tb.gradient :
//                 activeDisease === 'copd' ? DISEASE_COLORS.copd.gradient :
//                 activeDisease === 'pneumonia' ? DISEASE_COLORS.pneumonia.gradient :
//                 activeDisease === 'fibrosis' ? DISEASE_COLORS.fibrosis.gradient : ''
//               }`}></div>
//             </div>
//           )}
          
//           <div className="absolute top-4 right-4 bg-background/90 p-3 rounded-md border shadow-lg backdrop-blur-sm">
//             <div className="flex items-center gap-1 mb-2">
//               <span className="text-sm font-medium">Risk Level Legend:</span>
//             </div>
//             <div className="grid grid-cols-3 gap-2">
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-red-500/70 rounded-full"></div>
//                 <span className="text-xs">High</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-amber-500/70 rounded-full"></div>
//                 <span className="text-xs">Medium</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-green-500/70 rounded-full"></div>
//                 <span className="text-xs">Low</span>
//               </div>
//             </div>
//             <div className="mt-2 pt-2 border-t border-border/50">
//               <span className="text-sm font-medium">Disease Colors:</span>
//               <div className="grid grid-cols-2 gap-2 mt-1">
//                 <div className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-orange-500/70 rounded-full"></div>
//                   <span className="text-xs">TB</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-blue-500/70 rounded-full"></div>
//                   <span className="text-xs">COPD</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-purple-500/70 rounded-full"></div>
//                   <span className="text-xs">Fibrosis</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-red-500/70 rounded-full"></div>
//                   <span className="text-xs">Pneumonia</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default DistrictHeatmap;
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import { fetchDistrictData } from '@/services/dashboardService';
import { Calendar, Filter, MapPin, Navigation, Info, AlertTriangle, TrendingUp } from 'lucide-react';

const DISEASE_COLORS = {
  tb: {
    light: 'rgba(249, 115, 22, 0.7)',
    gradient: 'from-orange-500/70 to-orange-600/70'
  },
  copd: {
    light: 'rgba(59, 130, 246, 0.7)',
    gradient: 'from-blue-500/70 to-blue-600/70'
  },
  pneumonia: {
    light: 'rgba(239, 68, 68, 0.7)',
    gradient: 'from-red-500/70 to-red-600/70'
  },
  fibrosis: {
    light: 'rgba(139, 92, 246, 0.7)',
    gradient: 'from-purple-500/70 to-purple-600/70'
  },
  all: {
    high: 'rgba(239, 68, 68, 0.7)',
    medium: 'rgba(245, 158, 11, 0.7)',
    low: 'rgba(34, 197, 94, 0.7)'
  }
};

const RISK_LEVEL_COLORS = {
  high: 'rgba(239, 68, 68, 0.7)',
  medium: 'rgba(245, 158, 11, 0.7)',
  low: 'rgba(34, 197, 94, 0.7)'
};

const DistrictHeatmap = () => {
  const [activeDisease, setActiveDisease] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [customDays, setCustomDays] = useState(15);
  const [hoverInfo, setHoverInfo] = useState<{ district: string; cases: number } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const effectiveTimeRange = timeRange === 'custom' ? `${customDays}d` : timeRange;

  const { data: districtData = [], isLoading } = useQuery({
    queryKey: ['districtData', activeDisease, effectiveTimeRange],
    queryFn: () => fetchDistrictData(activeDisease, effectiveTimeRange),
  });

  const districts = Array.isArray(districtData) ? districtData : [];

  const summaryStats = {
    totalDistricts: districts.length,
    totalCases: districts.reduce((sum, district) => 
      sum + (activeDisease === 'all' ? district.total : district[activeDisease as keyof typeof district] as number), 0),
    flaggedZones: districts.filter(d => d.riskLevel === 'high').length,
    avgConfidence: 94.3
  };

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 500 500');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const districtPaths: Record<string, { path: string, name: string, center: {x: number, y: number} }> = {
      adilabad: { path: 'M210,40 L250,35 L265,50 L270,90 L250,110 L220,105 L190,80 L210,40', name: 'Adilabad', center: {x: 230, y: 70} },
      bhadradri: { path: 'M280,295 L310,290 L330,310 L325,340 L295,345 L280,325 L280,295', name: 'Bhadradri Kothagudem', center: {x: 305, y: 315} },
      hanumakonda: { path: 'M195,225 L215,215 L230,225 L225,245 L205,250 L195,225', name: 'Hanumakonda', center: {x: 215, y: 230} },
      hyderabad: { path: 'M130,245 L145,235 L155,255 L140,270 L125,265 L130,245', name: 'Hyderabad', center: {x: 140, y: 255} },
      jagtial: { path: 'M190,130 L210,120 L225,135 L215,160 L195,170 L175,160 L190,130', name: 'Jagtial', center: {x: 200, y: 145} },
      jangaon: { path: 'M170,225 L190,230 L195,245 L175,260 L155,255 L160,235 L170,225', name: 'Jangaon', center: {x: 175, y: 240} },
      jayashankar: { path: 'M160,195 L185,190 L190,215 L170,220 L155,210 L160,195', name: 'Jayashankar Bhupalpally', center: {x: 170, y: 205} },
      jogulamba: { path: 'M70,330 L90,340 L85,365 L60,360 L50,340 L70,330', name: 'Jogulamba Gadwal', center: {x: 70, y: 345} },
      kamareddy: { path: 'M120,140 L145,130 L155,155 L140,180 L110,175 L105,155 L120,140', name: 'Kamareddy', center: {x: 130, y: 155} },
      karimnagar: { path: 'M175,160 L195,150 L210,170 L200,190 L180,195 L165,180 L175,160', name: 'Karimnagar', center: {x: 190, y: 175} },
      khammam: { path: 'M240,275 L265,265 L285,275 L290,295 L265,315 L245,310 L240,275', name: 'Khammam', center: {x: 265, y: 290} },
      kumuram: { path: 'M240,40 L270,35 L285,55 L275,80 L250,75 L235,60 L240,40', name: 'Komaram Bheem', center: {x: 260, y: 55} },
      mahabubabad: { path: 'M190,245 L210,240 L215,265 L195,270 L185,255 L190,245', name: 'Mahabubabad', center: {x: 200, y: 255} },
      mahabubnagar: { path: 'M95,290 L120,300 L115,330 L90,340 L70,330 L80,300 L95,290', name: 'Mahabubnagar', center: {x: 95, y: 315} },
      mancherial: { path: 'M230,90 L260,80 L265,105 L240,115 L225,110 L230,90', name: 'Mancherial', center: {x: 245, y: 100} },
      medak: { path: 'M100,200 L125,195 L135,215 L120,235 L95,225 L100,200', name: 'Medak', center: {x: 115, y: 215} },
      medchal: { path: 'M125,240 L140,235 L150,255 L135,270 L120,265 L125,240', name: 'Medchal-Malkajgiri', center: {x: 135, y: 250} },
      mulugu: { path: 'M165,210 L185,205 L190,235 L175,240 L160,230 L165,210', name: 'Mulugu', center: {x: 175, y: 225} },
      nagarkurnool: { path: 'M105,300 L130,295 L140,315 L125,335 L105,330 L105,300', name: 'Nagarkurnool', center: {x: 120, y: 315} },
      nalgonda: { path: 'M160,275 L185,265 L205,280 L200,305 L175,315 L155,300 L160,275', name: 'Nalgonda', center: {x: 180, y: 290} },
      narayanpet: { path: 'M85,330 L105,325 L110,350 L90,360 L75,345 L85,330', name: 'Narayanpet', center: {x: 95, y: 340} },
      nirmal: { path: 'M185,80 L215,75 L225,105 L205,120 L180,115 L175,95 L185,80', name: 'Nirmal', center: {x: 200, y: 100} },
      nizamabad: { path: 'M140,120 L170,110 L180,140 L160,165 L135,160 L125,140 L140,120', name: 'Nizamabad', center: {x: 150, y: 140} },
      peddapalli: { path: 'M190,150 L220,140 L235,155 L225,175 L200,180 L190,165 L190,150', name: 'Peddapalli', center: {x: 210, y: 160} },
      rajanna: { path: 'M175,160 L195,155 L210,170 L195,185 L175,180 L175,160', name: 'Rajanna Sircilla', center: {x: 190, y: 170} },
      rangareddy: { path: 'M120,255 L140,245 L155,265 L140,285 L115,280 L120,255', name: 'Rangareddy', center: {x: 135, y: 265} },
      sangareddy: { path: 'M85,190 L110,180 L120,200 L105,225 L85,220 L75,205 L85,190', name: 'Sangareddy', center: {x: 95, y: 205} },
      siddipet: { path: 'M130,190 L155,180 L170,195 L160,215 L140,220 L130,200 L130,190', name: 'Siddipet', center: {x: 145, y: 200} },
      suryapet: { path: 'M195,260 L220,250 L235,265 L230,290 L205,300 L190,280 L195,260', name: 'Suryapet', center: {x: 210, y: 275} },
      vikarabad: { path: 'M85,235 L105,225 L115,245 L95,265 L75,255 L85,235', name: 'Vikarabad', center: {x: 95, y: 245} },
      wanaparthy: { path: 'M95,305 L115,300 L120,325 L100,335 L90,320 L95,305', name: 'Wanaparthy', center: {x: 105, y: 320} },
      warangal: { path: 'M185,205 L205,195 L220,205 L215,225 L195,230 L185,215 L185,205', name: 'Warangal', center: {x: 200, y: 210} },
      yadadri: { path: 'M155,255 L175,245 L190,260 L185,280 L165,285 L150,275 L155,255', name: 'Yadadri Bhuvanagiri', center: {x: 170, y: 265} }
    };

    Object.entries(districtPaths).forEach(([id, district]) => {
      const districtData = districts.find(d => d.id === id) || {
        id,
        name: district.name,
        total: 0,
        tb: 0,
        copd: 0,
        pneumonia: 0,
        fibrosis: 0,
        riskLevel: 'low' as 'high' | 'medium' | 'low'
      };

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', district.path);

      let fillColor = '#e5e7eb';
      if (activeDisease === 'all') {
        fillColor = RISK_LEVEL_COLORS[districtData.riskLevel as keyof typeof RISK_LEVEL_COLORS] || '#e5e7eb';
      } else {
        const diseaseColor = DISEASE_COLORS[activeDisease as keyof typeof DISEASE_COLORS];
        if ('light' in diseaseColor) {
          fillColor = diseaseColor.light;
        } else {
          fillColor = '#e5e7eb';
        }
      }

      path.setAttribute('fill', fillColor);
      path.setAttribute('stroke', id === selectedDistrict ? 'hsl(var(--primary))' : '#ffffff');
      path.setAttribute('stroke-width', id === selectedDistrict ? '3' : '2');
      path.setAttribute('class', 'transition-colors duration-300 cursor-pointer hover:stroke-primary hover:stroke-[3]');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', district.center.x.toString());
      text.setAttribute('y', district.center.y.toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '10px');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('pointer-events', 'none');
      text.textContent = district.name;

      path.addEventListener('mouseover', () => {
        setHoverInfo({ 
          district: districtData.name, 
          cases: activeDisease === 'all' ? districtData.total : districtData[activeDisease as keyof typeof districtData] as number 
        });
        path.setAttribute('stroke-width', '3');
        path.setAttribute('stroke', 'hsl(var(--primary))');
      });

      path.addEventListener('mouseout', () => {
        if (id !== selectedDistrict) {
          setHoverInfo(null);
          path.setAttribute('stroke-width', '2');
          path.setAttribute('stroke', '#ffffff');
        }
      });

      path.addEventListener('click', () => {
        if (selectedDistrict === id) {
          setSelectedDistrict(null);
          path.setAttribute('stroke-width', '2');
          path.setAttribute('stroke', '#ffffff');
        } else {
          setSelectedDistrict(id);
          path.setAttribute('stroke-width', '3');
          path.setAttribute('stroke', 'hsl(var(--primary))');
        }
      });

      svg.appendChild(path);
      svg.appendChild(text);
    });

    mapRef.current.appendChild(svg);

  }, [districts, activeDisease, selectedDistrict, effectiveTimeRange]);

  return (
    <Card className="dashboard-card col-span-12 border-2 border-border/30 overflow-hidden shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between pb-2 bg-gradient-to-r from-background to-muted/30">
        <div>
          <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Telangana District Disease Load Heatmap
          </CardTitle>
          <p className="text-sm text-muted-foreground">District-level visualization of disease distribution across Telangana</p>
        </div>
        <Tabs defaultValue="7d" value={timeRange} onValueChange={setTimeRange} className="w-auto">
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-4 bg-gradient-to-br from-background to-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="bg-background/80 p-3 rounded-md border shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="h-4 w-4" />
              <span className="text-xs">Total Districts</span>
            </div>
            <span className="text-xl font-semibold">{summaryStats.totalDistricts}</span>
          </div>
          <div className="bg-background/80 p-3 rounded-md border shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Total Cases</span>
            </div>
            <span className="text-xl font-semibold">{summaryStats.totalCases.toLocaleString()}</span>
          </div>
          <div className="bg-background/80 p-3 rounded-md border shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">Flagged Zones</span>
            </div>
            <span className="text-xl font-semibold">{summaryStats.flaggedZones}</span>
          </div>
          <div className="bg-background/80 p-3 rounded-md border shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Info className="h-4 w-4" />
              <span className="text-xs">Avg AI Confidence</span>
            </div>
            <span className="text-xl font-semibold">{summaryStats.avgConfidence}%</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex-1">
              <Button 
                variant={activeDisease === 'all' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveDisease('all')}
                className="shadow-sm"
              >
                <Filter className="h-4 w-4 mr-1" />
                All Diseases
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 flex-1 md:flex-[2]">
              <Button 
                variant={activeDisease === 'tb' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveDisease('tb')}
                className={`border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white shadow-sm ${activeDisease === 'tb' ? 'bg-orange-600 text-white' : ''}`}
              >
                Tuberculosis
              </Button>
              <Button 
                variant={activeDisease === 'copd' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveDisease('copd')}
                className={`border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm ${activeDisease === 'copd' ? 'bg-blue-600 text-white' : ''}`}
              >
                COPD
              </Button>
              <Button 
                variant={activeDisease === 'fibrosis' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveDisease('fibrosis')}
                className={`border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white shadow-sm ${activeDisease === 'fibrosis' ? 'bg-purple-600 text-white' : ''}`}
              >
                Fibrosis
              </Button>
              <Button 
                variant={activeDisease === 'pneumonia' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveDisease('pneumonia')}
                className={`border-red-600 text-red-600 hover:bg-red-600 hover:text-white shadow-sm ${activeDisease === 'pneumonia' ? 'bg-red-600 text-white' : ''}`}
              >
                Pneumonia
              </Button>
            </div>
          </div>

          {timeRange === 'custom' && (
            <div className="bg-background/50 p-3 rounded-md border mb-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Custom Days: <span className="font-bold">{customDays}</span>
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Slide to adjust the number of days in your custom date range</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider 
  value={[customDays]} 
  min={5} 
  max={180} 
  step={5} // Update step to 5 to match the 5-day intervals
  onValueChange={(vals) => setCustomDays(vals[0])} 
  className="py-4"
/>
<div className="flex justify-between text-xs text-muted-foreground">
  <span>5 days</span>
  <span>90 days</span>
  <span>180 days</span>
</div>
              {/* <Slider 
                value={[customDays]} 
                min={1} 
                max={180} 
                step={1}
                onValueChange={(vals) => setCustomDays(vals[0])} 
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 day</span>
                <span>90 days</span>
                <span>180 days</span>
              </div> */}
            </div>
          )}
        </div>

        <div className="h-[460px] rounded-xl border relative bg-gradient-to-br from-background to-muted flex items-center justify-center shadow-inner overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_70%)]"></div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Loading map data...</p>
            </div>
          ) : (
            <div 
              ref={mapRef} 
              className="w-full h-full p-4 relative"
            ></div>
          )}

          <div className="absolute bottom-4 right-4 bg-background/90 p-3 rounded-md border shadow-lg backdrop-blur-sm">
            <h4 className="font-medium flex items-center gap-2">
              <Navigation className="h-4 w-4" /> Telangana Districts
            </h4>
            <ul className="mt-1 space-y-1 max-h-[200px] overflow-auto pr-2 scrollbar-thin">
              {districts.map(district => (
                <li 
                  key={district.id} 
                  className={`flex justify-between gap-4 p-1 rounded cursor-pointer ${
                    selectedDistrict === district.id ? 'bg-primary/20' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedDistrict(selectedDistrict === district.id ? null : district.id)}
                >
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {district.name}
                  </span>
                  <span className="font-medium">{activeDisease === 'all' ? district.total : district[activeDisease as keyof typeof district]} cases</span>
                </li>
              ))}
            </ul>
          </div>

          {hoverInfo && (
            <div className="absolute top-4 left-4 bg-background/90 border rounded-md shadow-lg p-3 animate-fade-in backdrop-blur-sm">
              <h4 className="font-medium">{hoverInfo.district}</h4>
              <p className="text-sm">
                <span className="font-medium">{hoverInfo.cases.toLocaleString()}</span> 
                {activeDisease === 'all' ? ' total' : ` ${activeDisease}`} cases detected
              </p>
              <div className={`h-1 w-full mt-1 rounded-full bg-gradient-to-r ${activeDisease === 'all' ? 'from-green-500 to-red-500' : 
                activeDisease === 'tb' ? DISEASE_COLORS.tb.gradient :
                activeDisease === 'copd' ? DISEASE_COLORS.copd.gradient :
                activeDisease === 'pneumonia' ? DISEASE_COLORS.pneumonia.gradient :
                activeDisease === 'fibrosis' ? DISEASE_COLORS.fibrosis.gradient : ''
              }`}></div>
            </div>
          )}

          <div className="absolute top-4 right-4 bg-background/90 p-3 rounded-md border shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-sm font-medium">Risk Level Legend:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500/70 rounded-full"></div>
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-500/70 rounded-full"></div>
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500/70 rounded-full"></div>
                <span className="text-xs">Low</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border/50">
              <span className="text-sm font-medium">Disease Colors:</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500/70 rounded-full"></div>
                  <span className="text-xs">TB</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500/70 rounded-full"></div>
                  <span className="text-xs">COPD</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500/70 rounded-full"></div>
                  <span className="text-xs">Fibrosis</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500/70 rounded-full"></div>
                  <span className="text-xs">Pneumonia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistrictHeatmap;