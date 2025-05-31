import React, { useRef, useEffect, useState, useCallback } from 'react';
import { telanganaDistrictBoundaries, getDistrictPath, getDistrictCentroid } from '@/utils/telanganaGeoData';

interface MapRendererProps {
  width: number;
  height: number;
  districts: any[];
  activeDisease: string;
  selectedDistrict?: string;
  onDistrictClick?: (districtId: string) => void;
  onDistrictHover?: (district: any) => void;
  renderMode?: 'heatmap' | 'choropleth' | 'dotdensity';
  showLabels?: boolean;
  interactive?: boolean;
}

export const MapRenderer: React.FC<MapRendererProps> = ({
  width,
  height,
  districts,
  activeDisease,
  selectedDistrict,
  onDistrictClick,
  onDistrictHover,
  renderMode = 'heatmap',
  showLabels = true,
  interactive = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState(`0 0 ${width} ${height}`);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Color calculation based on render mode
  const getDistrictColor = useCallback((district: any) => {
    if (!district) return '#e5e7eb';

    switch (renderMode) {
      case 'heatmap':
        return getHeatmapColor(district, activeDisease);
      case 'choropleth':
        return getChoroplethColor(district, activeDisease);
      case 'dotdensity':
        return getDotDensityColor(district, activeDisease);
      default:
        return '#e5e7eb';
    }
  }, [renderMode, activeDisease]);

  const getHeatmapColor = (district: any, disease: string) => {
    const value = disease === 'all' ? district.total : district[disease];
    const maxValue = Math.max(...districts.map(d => disease === 'all' ? d.total : d[disease]));
    const intensity = value / maxValue;
    
    const colors = {
      tb: `rgba(249, 115, 22, ${0.3 + intensity * 0.7})`,
      copd: `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`,
      pneumonia: `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`,
      fibrosis: `rgba(139, 92, 246, ${0.3 + intensity * 0.7})`,
      all: `rgba(99, 102, 241, ${0.3 + intensity * 0.7})`,
    };
    
    return colors[disease as keyof typeof colors] || '#e5e7eb';
  };

  const getChoroplethColor = (district: any, disease: string) => {
    const riskColors = {
      high: 'rgba(239, 68, 68, 0.8)',
      medium: 'rgba(245, 158, 11, 0.8)',
      low: 'rgba(34, 197, 94, 0.8)',
    };
    return riskColors[district.riskLevel as keyof typeof riskColors] || '#e5e7eb';
  };

  const getDotDensityColor = (district: any, disease: string) => {
    // For dot density, we'll use a base color and vary opacity
    return `rgba(99, 102, 241, 0.6)`;
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    svg.innerHTML = ''; // Clear existing content

    // Create district paths
    telanganaDistrictBoundaries.features.forEach((feature) => {
      const districtId = feature.properties.id;
      const districtName = feature.properties.name;
      const districtData = districts.find(d => d.id === districtId);
      
      if (!districtData) return;

      const path = getDistrictPath(districtId, width, height);
      const centroid = getDistrictCentroid(districtId, width, height);
      
      // Create path element
      const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathElement.setAttribute('d', path);
      pathElement.setAttribute('fill', getDistrictColor(districtData));
      pathElement.setAttribute('stroke', selectedDistrict === districtId ? '#3b82f6' : '#ffffff');
      pathElement.setAttribute('stroke-width', selectedDistrict === districtId ? '3' : '1');
      pathElement.setAttribute('class', 'transition-all duration-300 cursor-pointer');
      
      if (interactive) {
        pathElement.addEventListener('click', () => onDistrictClick?.(districtId));
        pathElement.addEventListener('mouseenter', () => onDistrictHover?.(districtData));
        pathElement.addEventListener('mouseleave', () => onDistrictHover?.(null));
      }

      svg.appendChild(pathElement);

      // Add labels if enabled
      if (showLabels) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', centroid.x.toString());
        text.setAttribute('y', centroid.y.toString());
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '8');
        text.setAttribute('fill', '#374151');
        text.setAttribute('pointer-events', 'none');
        text.textContent = districtName;
        svg.appendChild(text);
      }

      // Add dots for dot density mode
      if (renderMode === 'dotdensity') {
        const dotCount = Math.floor((districtData[activeDisease] || 0) / 10);
        for (let i = 0; i < Math.min(dotCount, 20); i++) {
          const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          const randomX = centroid.x + (Math.random() - 0.5) * 30;
          const randomY = centroid.y + (Math.random() - 0.5) * 30;
          
          dot.setAttribute('cx', randomX.toString());
          dot.setAttribute('cy', randomY.toString());
          dot.setAttribute('r', '1.5');
          dot.setAttribute('fill', '#3b82f6');
          dot.setAttribute('opacity', '0.7');
          svg.appendChild(dot);
        }
      }
    });
  }, [districts, activeDisease, selectedDistrict, renderMode, showLabels, interactive, width, height, getDistrictColor]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={viewBox}
      className="w-full h-full"
    />
  );
};
