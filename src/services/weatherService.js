const BASE_URL   = 'https://api.open-meteo.com/v1/forecast';
const LATITUDE   = -26.2041;   // Gauteng
const LONGITUDE  =  28.0473;

// WMO weather codes → icon + label
// Open-Meteo returns a number like 0, 63, 95
// This table converts those numbers to something readable
const WMO_CODES = {
  0:  { icon: '☀️',  condition: 'Clear Sky' },
  1:  { icon: '🌤',  condition: 'Mostly Clear' },
  2:  { icon: '⛅',  condition: 'Partly Cloudy' },
  3:  { icon: '☁️',  condition: 'Overcast' },
  45: { icon: '🌫',  condition: 'Foggy' },
  51: { icon: '🌦',  condition: 'Light Drizzle' },
  61: { icon: '🌧',  condition: 'Light Rain' },
  63: { icon: '🌧',  condition: 'Moderate Rain' },
  65: { icon: '🌧',  condition: 'Heavy Rain' },
  80: { icon: '🌦',  condition: 'Rain Showers' },
  95: { icon: '⛈',  condition: 'Thunderstorm' },
};

function decodeWeather(code) {
  return WMO_CODES[code] ?? { icon: '🌤', condition: 'Variable' };
}

// -------------------------------------------------------

export async function fetchWeather() {
  const params = new URLSearchParams({
    latitude:  LATITUDE,
    longitude: LONGITUDE,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'wind_speed_10m',
      'weather_code',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'weather_code',
      'wind_speed_10m_max',
    ].join(','),
    forecast_days: 5,
    timezone: 'Africa/Johannesburg',
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch weather');
  const raw = await res.json();

  return transform(raw);
}

// -------------------------------------------------------
// Transform raw API data → shape your Weather.jsx expects

function transform(raw) {
  const c = raw.current;

  // --- current conditions ---
  const current = {
    temp:      Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity:  c.relative_humidity_2m,
    wind:      Math.round(c.wind_speed_10m),
    uvIndex:   c.uv_index ?? 0,
    ...decodeWeather(c.weather_code),
  };

  // --- hourly: next 8 hours from now ---
  const h       = raw.hourly;
  const nowHour = new Date().getHours();
  const hourlyForecast = Array.from({ length: 8 }, (_, i) => {
    const idx = nowHour + i;
    return {
      time: `${String(idx % 24).padStart(2, '0')}:00`,
      temp: Math.round(h.temperature_2m[idx] ?? 0),
      rain: h.precipitation_probability[idx] ?? 0,
      ...decodeWeather(h.weather_code[idx] ?? 0),
    };
  });

  // --- 5-day daily ---
  const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = raw.daily;

  const extendedForecast = d.time.map((dateStr, i) => {
    const dt = new Date(dateStr);
    return {
      day:       DAY_NAMES[dt.getDay()],
      date:      `${dt.getDate()} ${MONTH_NAMES[dt.getMonth()]}`,
      high:      Math.round(d.temperature_2m_max[i]),
      low:       Math.round(d.temperature_2m_min[i]),
      rain:      d.precipitation_probability_max[i],
      wind:      Math.round(d.wind_speed_10m_max[i]),
      humidity:  60,   // not in daily — keep static or add hourly avg
      ...decodeWeather(d.weather_code[i]),
    };
  });

  return { current, hourlyForecast, extendedForecast };
}
