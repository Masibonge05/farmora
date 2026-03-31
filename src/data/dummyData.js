export const farmFields = [
  { id: 1, name: 'Field A — Maize', hectares: 4.2, status: 'healthy', moisture: 68, ndvi: 0.82, lastScan: '2h ago', crop: 'Maize', location: 'North Plot' },
  { id: 2, name: 'Field B — Tomatoes', hectares: 1.8, status: 'warning', moisture: 42, ndvi: 0.61, lastScan: '4h ago', crop: 'Tomatoes', location: 'South Plot' },
  { id: 3, name: 'Field C — Spinach', hectares: 0.9, status: 'healthy', moisture: 74, ndvi: 0.88, lastScan: '1h ago', crop: 'Spinach', location: 'East Plot' },
  { id: 4, name: 'Field D — Sorghum', hectares: 3.1, status: 'alert', moisture: 28, ndvi: 0.45, lastScan: '6h ago', crop: 'Sorghum', location: 'West Plot' },
];

export const soilMetrics = [
  { time: '06:00', moisture: 62, temp: 18, pH: 6.4 },
  { time: '08:00', moisture: 65, temp: 19, pH: 6.5 },
  { time: '10:00', moisture: 60, temp: 22, pH: 6.4 },
  { time: '12:00', moisture: 55, temp: 26, pH: 6.3 },
  { time: '14:00', moisture: 50, temp: 28, pH: 6.2 },
  { time: '16:00', moisture: 48, temp: 27, pH: 6.3 },
  { time: '18:00', moisture: 52, temp: 24, pH: 6.4 },
  { time: '20:00', moisture: 58, temp: 21, pH: 6.5 },
];

export const yieldForecast = [
  { month: 'Jan', actual: 2.1, forecast: 2.3 },
  { month: 'Feb', actual: 2.4, forecast: 2.5 },
  { month: 'Mar', actual: 2.8, forecast: 2.7 },
  { month: 'Apr', actual: 3.1, forecast: 3.0 },
  { month: 'May', actual: 2.9, forecast: 3.2 },
  { month: 'Jun', actual: null, forecast: 3.5 },
  { month: 'Jul', actual: null, forecast: 3.8 },
];

export const alerts = [
  { id: 1, type: 'alert', field: 'Field D', message: 'Critical moisture deficit detected — irrigation recommended', time: '6 min ago', icon: '💧' },
  { id: 2, type: 'warning', field: 'Field B', message: 'Early-stage leaf spot detected via AI scan', time: '1h ago', icon: '🍃' },
  { id: 3, type: 'info', field: 'Field A', message: 'Optimal harvest window opens in 12 days', time: '3h ago', icon: '🌽' },
  { id: 4, type: 'success', field: 'Field C', message: 'Irrigation cycle completed — moisture normalised', time: '5h ago', icon: '✅' },
];

export const marketPrices = [
  { crop: 'Maize', price: 'R 4,280', unit: '/ton', change: '+3.2%', trend: 'up', buyers: 8 },
  { crop: 'Tomatoes', price: 'R 12,500', unit: '/ton', change: '-1.4%', trend: 'down', buyers: 12 },
  { crop: 'Spinach', price: 'R 8,900', unit: '/ton', change: '+6.8%', trend: 'up', buyers: 5 },
  { crop: 'Sorghum', price: 'R 3,100', unit: '/ton', change: '+0.9%', trend: 'up', buyers: 3 },
];

export const sensorNodes = [
  { id: 'SN-01', field: 'Field A', battery: 92, signal: 'Strong', lastPing: '2m ago', status: 'online' },
  { id: 'SN-02', field: 'Field B', battery: 67, signal: 'Good', lastPing: '5m ago', status: 'online' },
  { id: 'SN-03', field: 'Field C', battery: 41, signal: 'Weak', lastPing: '8m ago', status: 'online' },
  { id: 'SN-04', field: 'Field D', battery: 15, signal: 'Poor', lastPing: '22m ago', status: 'warning' },
  { id: 'SN-05', field: 'Field A', battery: 88, signal: 'Strong', lastPing: '1m ago', status: 'online' },
];

export const diseaseScans = [
  { field: 'Field B', disease: 'Leaf Spot', confidence: 84, severity: 'Moderate', action: 'Apply fungicide within 48h' },
  { field: 'Field D', disease: 'Root Rot Risk', confidence: 71, severity: 'High', action: 'Reduce irrigation, improve drainage' },
  { field: 'Field A', disease: 'None detected', confidence: 98, severity: 'Clear', action: 'Continue monitoring' },
  { field: 'Field C', disease: 'None detected', confidence: 96, severity: 'Clear', action: 'Continue monitoring' },
];

export const weatherData = {
  current: { temp: 24, humidity: 58, wind: 12, condition: 'Partly Cloudy', icon: '⛅' },
  forecast: [
    { day: 'Tomorrow', high: 26, low: 14, rain: '20%', icon: '🌤' },
    { day: 'Wednesday', high: 21, low: 12, rain: '70%', icon: '🌧' },
    { day: 'Thursday', high: 18, low: 10, rain: '85%', icon: '⛈' },
    { day: 'Friday', high: 23, low: 13, rain: '15%', icon: '🌤' },
  ]
};

