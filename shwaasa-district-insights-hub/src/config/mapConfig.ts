export interface MapTheme {
  name: string;
  colors: {
    background: string;
    border: string;
    water: string;
    roads: string;
    labels: string;
    hover: string;
    selected: string;
  };
  diseases: {
    [key: string]: {
      primary: string;
      secondary: string;
      gradient: string[];
    };
  };
  riskLevels: {
    low: string;
    medium: string;
    high: string;
  };
}

export const mapThemes: { [key: string]: MapTheme } = {
  default: {
    name: 'Classic',
    colors: {
      background: '#f8fafc',
      border: '#e2e8f0',
      water: 'rgba(186,230,253,0.6)',
      roads: 'rgba(156,163,175,0.5)',
      labels: '#374151',
      hover: '#3b82f6',
      selected: '#1d4ed8',
    },
    diseases: {
      tb: {
        primary: '#f97316',
        secondary: '#fed7aa',
        gradient: ['#fed7aa', '#f97316', '#ea580c'],
      },
      copd: {
        primary: '#3b82f6',
        secondary: '#bfdbfe',
        gradient: ['#bfdbfe', '#3b82f6', '#1d4ed8'],
      },
      pneumonia: {
        primary: '#ef4444',
        secondary: '#fecaca',
        gradient: ['#fecaca', '#ef4444', '#dc2626'],
      },
      fibrosis: {
        primary: '#8b5cf6',
        secondary: '#ddd6fe',
        gradient: ['#ddd6fe', '#8b5cf6', '#7c3aed'],
      },
    },
    riskLevels: {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
    },
  },
  dark: {
    name: 'Dark Mode',
    colors: {
      background: '#0f172a',
      border: '#334155',
      water: 'rgba(59,130,246,0.3)',
      roads: 'rgba(148,163,184,0.3)',
      labels: '#e2e8f0',
      hover: '#60a5fa',
      selected: '#3b82f6',
    },
    diseases: {
      tb: {
        primary: '#fb923c',
        secondary: '#1f2937',
        gradient: ['#1f2937', '#fb923c', '#f97316'],
      },
      copd: {
        primary: '#60a5fa',
        secondary: '#1e293b',
        gradient: ['#1e293b', '#60a5fa', '#3b82f6'],
      },
      pneumonia: {
        primary: '#f87171',
        secondary: '#1f2937',
        gradient: ['#1f2937', '#f87171', '#ef4444'],
      },
      fibrosis: {
        primary: '#a78bfa',
        secondary: '#1e1b4b',
        gradient: ['#1e1b4b', '#a78bfa', '#8b5cf6'],
      },
    },
    riskLevels: {
      low: '#34d399',
      medium: '#fbbf24',
      high: '#f87171',
    },
  },
  colorblind: {
    name: 'Colorblind Friendly',
    colors: {
      background: '#fefefe',
      border: '#d1d5db',
      water: 'rgba(147,197,253,0.4)',
      roads: 'rgba(107,114,128,0.4)',
      labels: '#1f2937',
      hover: '#0369a1',
      selected: '#0c4a6e',
    },
    diseases: {
      tb: {
        primary: '#0891b2',
        secondary: '#cffafe',
        gradient: ['#cffafe', '#0891b2', '#0e7490'],
      },
      copd: {
        primary: '#7c3aed',
        secondary: '#ede9fe',
        gradient: ['#ede9fe', '#7c3aed', '#6d28d9'],
      },
      pneumonia: {
        primary: '#dc2626',
        secondary: '#fee2e2',
        gradient: ['#fee2e2', '#dc2626', '#b91c1c'],
      },
      fibrosis: {
        primary: '#059669',
        secondary: '#d1fae5',
        gradient: ['#d1fae5', '#059669', '#047857'],
      },
    },
    riskLevels: {
      low: '#059669',
      medium: '#d97706',
      high: '#dc2626',
    },
  },
};

export interface MapConfiguration {
  theme: string;
  renderMode: 'heatmap' | 'choropleth' | 'dotdensity' | 'isopleth';
  showLabels: boolean;
  showWaterBodies: boolean;
  showRoads: boolean;
  enableAnimation: boolean;
  transitionDuration: number;
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

export const defaultMapConfig: MapConfiguration = {
  theme: 'default',
  renderMode: 'heatmap',
  showLabels: true,
  showWaterBodies: true,
  showRoads: false,
  enableAnimation: true,
  transitionDuration: 300,
  minZoom: 0.5,
  maxZoom: 5,
  clustering: {
    enabled: true,
    threshold: 50,
  },
  performance: {
    enableVirtualization: true,
    debounceMs: 300,
    maxFeatures: 1000,
  },
};