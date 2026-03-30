export const dashboardSections = [
  'overview',
  'crop-health',
  'soil',
  'alerts',
  'market',
  'sensors',
  'weather',
] as const;

export type DashboardSection = (typeof dashboardSections)[number];

export function isDashboardSection(value: string): value is DashboardSection {
  return dashboardSections.includes(value as DashboardSection);
}

export type HealthStatus = 'healthy' | 'warning' | 'alert';
export type AlertLevel = 'alert' | 'warning' | 'info' | 'success';
export type TrendDirection = 'up' | 'down' | 'steady';
export type SensorStatus = 'online' | 'warning' | 'offline';
export type AdvisoryStatus = 'ok' | 'warn' | 'alert';
export type Tone = 'good' | 'warning' | 'critical' | 'info';
export type WeatherIconKey =
  | 'sun'
  | 'cloud-sun'
  | 'cloud-rain'
  | 'cloud-lightning'
  | 'cloud-moon';

export interface FarmProfile {
  id: string;
  name: string;
  farmerName: string;
  location: string;
  region: string;
  country: string;
  hectares: number;
  sensorCoverageLabel: string;
  liveTemperatureC: number;
}

export interface DashboardKpi {
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}

export interface Recommendation {
  title: string;
  field: string;
  description: string;
  tone: Tone;
}

export interface FieldHealth {
  id: number;
  name: string;
  crop: string;
  location: string;
  hectares: number;
  status: HealthStatus;
  moisture: number;
  ndvi: number;
  lastScan: string;
}

export interface YieldForecastPoint {
  month: string;
  actual: number | null;
  forecast: number;
}

export interface RadarMetricPoint {
  metric: string;
  A: number;
  B: number;
  C: number;
  D: number;
}

export interface DiseaseScan {
  field: string;
  disease: string;
  confidence: number;
  severity: 'Clear' | 'Moderate' | 'High';
  action: string;
}

export interface SoilMetricPoint {
  time: string;
  moisture: number;
  temp: number;
  pH: number;
}

export interface SoilNode {
  id: string;
  field: string;
  moisture: number;
  pH: number;
  temp: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export interface AlertItem {
  id: number;
  type: AlertLevel;
  field: string;
  message: string;
  time: string;
  iconLabel: string;
}

export interface MarketPrice {
  crop: string;
  price: string;
  unit: string;
  change: string;
  trend: TrendDirection;
  buyers: number;
}

export interface BuyerProfile {
  id: number;
  name: string;
  type: string;
  crops: string[];
  rating: number;
  distance: string;
  verified: boolean;
  priceOffer: string;
}

export interface PriceHistoryPoint {
  week: string;
  maize: number;
  tomatoes: number;
  spinach: number;
  sorghum: number;
}

export interface SensorNode {
  id: string;
  field: string;
  battery: number;
  signal: string;
  lastPing: string;
  status: SensorStatus;
}

export interface NetworkStat {
  label: string;
  value: string;
  good: boolean;
}

export interface WeatherCurrent {
  temp: number;
  humidity: number;
  wind: number;
  condition: string;
}

export interface HourlyForecastPoint {
  time: string;
  temp: number;
  rain: number;
  icon: WeatherIconKey;
}

export interface DailyForecastPoint {
  day: string;
  date: string;
  high: number;
  low: number;
  rain: number;
  humidity: number;
  wind: number;
  condition: string;
  icon: WeatherIconKey;
}

export interface IrrigationAdvisory {
  field: string;
  crop: string;
  today: string;
  note: string;
  status: AdvisoryStatus;
}

export interface DashboardSnapshot {
  farm: FarmProfile;
  overview: {
    kpis: DashboardKpi[];
    recommendations: Recommendation[];
    yieldForecast: YieldForecastPoint[];
  };
  cropHealth: {
    fields: FieldHealth[];
    radarMetrics: RadarMetricPoint[];
    diseaseScans: DiseaseScan[];
    recommendations: Recommendation[];
  };
  soil: {
    metrics: SoilMetricPoint[];
    nodes: SoilNode[];
    recommendations: Recommendation[];
  };
  alerts: {
    items: AlertItem[];
  };
  market: {
    prices: MarketPrice[];
    buyers: BuyerProfile[];
    priceHistory: PriceHistoryPoint[];
  };
  sensors: {
    nodes: SensorNode[];
    networkStats: NetworkStat[];
  };
  weather: {
    current: WeatherCurrent;
    hourly: HourlyForecastPoint[];
    extended: DailyForecastPoint[];
    irrigationAdvisory: IrrigationAdvisory[];
  };
}
