export interface DataPoint {
  timestamp: number;
  districtId: string;
  disease: string;
  cases: number;
  severity: 'low' | 'medium' | 'high';
  coordinates?: { lat: number; lng: number };
  metadata?: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string; // e.g., "cases > 100"
  districts: string[];
  diseases: string[];
  enabled: boolean;
  priority: 'low' | 'medium' | 'high';
  actions: string[];
}

export class MapDataService {
  private static instance: MapDataService;
  private cache = new Map<string, any>();
  private subscribers = new Set<(data: any) => void>();
  private alertRules: AlertRule[] = [];
  private wsConnection: WebSocket | null = null;

  static getInstance(): MapDataService {
    if (!MapDataService.instance) {
      MapDataService.instance = new MapDataService();
    }
    return MapDataService.instance;
  }

  // Real-time data subscription
  subscribe(callback: (data: any) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(data: any) {
    this.subscribers.forEach(callback => callback(data));
  }

  // WebSocket connection for real-time updates
  connectWebSocket(url: string) {
    try {
      this.wsConnection = new WebSocket(url);
      
      this.wsConnection.onopen = () => {
        console.log('WebSocket connected');
      };
      
      this.wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleRealtimeUpdate(data);
      };
      
      this.wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      this.wsConnection.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(() => this.connectWebSocket(url), 5000);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  private handleRealtimeUpdate(data: DataPoint | DataPoint[]) {
    const updates = Array.isArray(data) ? data : [data];
    
    updates.forEach(update => {
      this.updateCache(update);
      this.checkAlertRules(update);
    });
    
    this.notifySubscribers(updates);
  }

  private updateCache(dataPoint: DataPoint) {
    const key = `${dataPoint.districtId}-${dataPoint.disease}`;
    const existing = this.cache.get(key) || [];
    existing.push(dataPoint);
    
    // Keep only last 100 points per district-disease combination
    if (existing.length > 100) {
      existing.splice(0, existing.length - 100);
    }
    
    this.cache.set(key, existing);
  }

  // Fetch aggregated data with caching
  async fetchDistrictData(
    disease: string = 'all',
    timeRange: string = '7d',
    useCache: boolean = true
  ): Promise<any[]> {
    const cacheKey = `district-data-${disease}-${timeRange}`;
    
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes
        return cached.data;
      }
    }

    try {
      const response = await fetch(`/api/districts?disease=${disease}&timeRange=${timeRange}`);
      const data = await response.json();
      
      // Process and enrich data
      const enrichedData = await this.enrichDistrictData(data);
      
      this.cache.set(cacheKey, {
        data: enrichedData,
        timestamp: Date.now(),
      });
      
      return enrichedData;
    } catch (error) {
      console.error('Failed to fetch district data:', error);
      return [];
    }
  }

  private async enrichDistrictData(rawData: any[]): Promise<any[]> {
    return rawData.map(district => ({
      ...district,
      trend: this.calculateTrend(district.id, district.disease || 'all'),
      riskScore: this.calculateRiskScore(district),
      lastUpdated: Date.now(),
      alerts: this.getActiveAlerts(district.id),
    }));
  }

  private calculateTrend(districtId: string, disease: string): number {
    const key = `${districtId}-${disease}`;
    const historical = this.cache.get(key) || [];
    
    if (historical.length < 10) return 0;
    
    const recent = historical.slice(-5);
    const previous = historical.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum: number, dp: DataPoint) => sum + dp.cases, 0) / recent.length;
    const previousAvg = previous.reduce((sum: number, dp: DataPoint) => sum + dp.cases, 0) / previous.length;
    
    return previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
  }

  private calculateRiskScore(district: any): number {
    let score = 0;
    
    // Base risk from case count
    score += Math.min(district.total / 100, 1) * 40;
    
    // Population density factor
    if (district.population && district.area) {
      const density = district.population / district.area;
      score += Math.min(density / 1000, 1) * 20;
    }
    
    // Trend factor
    const trend = this.calculateTrend(district.id, 'all');
    if (trend > 10) score += 20;
    else if (trend > 0) score += 10;
    
    // Recent alerts factor
    const alerts = this.getActiveAlerts(district.id);
    score += alerts.length * 5;
    
    return Math.min(score, 100);
  }

  // Alert system
  addAlertRule(rule: AlertRule) {
    this.alertRules.push(rule);
  }

  removeAlertRule(ruleId: string) {
    this.alertRules = this.alertRules.filter(rule => rule.id !== ruleId);
  }

  private checkAlertRules(dataPoint: DataPoint) {
    this.alertRules
      .filter(rule => rule.enabled)
      .filter(rule => rule.districts.includes(dataPoint.districtId))
      .filter(rule => rule.diseases.includes(dataPoint.disease))
      .forEach(rule => {
        if (this.evaluateCondition(rule.condition, dataPoint)) {
          this.triggerAlert(rule, dataPoint);
        }
      });
  }

  private evaluateCondition(condition: string, dataPoint: DataPoint): boolean {
    try {
      // Simple condition evaluation (in production, use a proper expression parser)
      const expr = condition.replace('cases', dataPoint.cases.toString());
      return eval(expr);
    } catch {
      return false;
    }
  }

  private triggerAlert(rule: AlertRule, dataPoint: DataPoint) {
    const alert = {
      id: `alert-${Date.now()}-${rule.id}`,
      ruleId: rule.id,
      ruleName: rule.name,
      districtId: dataPoint.districtId,
      disease: dataPoint.disease,
      value: dataPoint.cases,
      priority: rule.priority,
      timestamp: Date.now(),
      acknowledged: false,
    };

    // Store alert
    const alertsKey = `alerts-${dataPoint.districtId}`;
    const existingAlerts = this.cache.get(alertsKey) || [];
    existingAlerts.push(alert);
    this.cache.set(alertsKey, existingAlerts);

    // Execute alert actions
    rule.actions.forEach(action => this.executeAlertAction(action, alert));
    
    // Notify subscribers
    this.notifySubscribers({ type: 'alert', data: alert });
  }

  private executeAlertAction(action: string, alert: any) {
    switch (action) {
      case 'email':
        this.sendEmailAlert(alert);
        break;
      case 'sms':
        this.sendSMSAlert(alert);
        break;
      case 'webhook':
        this.sendWebhookAlert(alert);
        break;
      case 'notification':
        this.showBrowserNotification(alert);
        break;
    }
  }

  private async sendEmailAlert(alert: any) {
    // Implement email sending logic
    console.log('Email alert sent:', alert);
  }

  private async sendSMSAlert(alert: any) {
    // Implement SMS sending logic
    console.log('SMS alert sent:', alert);
  }

  private async sendWebhookAlert(alert: any) {
    try {
      await fetch('/api/webhooks/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert),
      });
    } catch (error) {
      console.error('Webhook alert failed:', error);
    }
  }

  private showBrowserNotification(alert: any) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Health Alert: ${alert.ruleName}`, {
        body: `${alert.value} cases detected in ${alert.districtId}`,
        icon: '/alert-icon.png',
      });
    }
  }

  getActiveAlerts(districtId: string): any[] {
    const alertsKey = `alerts-${districtId}`;
    const alerts = this.cache.get(alertsKey) || [];
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return alerts.filter((alert: any) => 
      alert.timestamp > oneHourAgo && !alert.acknowledged
    );
  }

  // Data export functionality
  async exportData(
    format: 'json' | 'csv' | 'excel',
    filters: any = {}
  ): Promise<Blob> {
    const data = await this.fetchDistrictData(
      filters.disease || 'all',
      filters.timeRange || '30d',
      false
    );

    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(data, null, 2)], { 
          type: 'application/json' 
        });
      
      case 'csv':
        const csv = this.convertToCSV(data);
        return new Blob([csv], { type: 'text/csv' });
      
      case 'excel':
        // This would require a library like SheetJS
        return new Blob([JSON.stringify(data)], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
      
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  }
}