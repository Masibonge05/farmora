import { useEffect, useMemo, useState } from 'react';
import { weatherData } from '../data/dummyData';
import useMediaQuery from '../lib/useMediaQuery';
import { fetchWeather } from '../services/weatherService';

const fallbackHourlyForecast = [
  { time: '06:00', temp: 17, icon: '⛅', rain: 5 },
  { time: '08:00', temp: 19, icon: '🌤', rain: 5 },
  { time: '10:00', temp: 22, icon: '☀️', rain: 0 },
  { time: '12:00', temp: 24, icon: '☀️', rain: 0 },
  { time: '14:00', temp: 26, icon: '☀️', rain: 0 },
  { time: '16:00', temp: 25, icon: '⛅', rain: 10 },
  { time: '18:00', temp: 22, icon: '🌧', rain: 15 },
  { time: '20:00', temp: 19, icon: '⛅', rain: 5 },
];

const fallbackExtendedForecast = [
  { day: 'Monday', date: '31 Mar', high: 26, low: 14, rain: 10, icon: '🌤', condition: 'Mostly Sunny' },
  { day: 'Tuesday', date: '1 Apr', high: 24, low: 13, rain: 25, icon: '⛅', condition: 'Partly Cloudy' },
  { day: 'Wednesday', date: '2 Apr', high: 21, low: 12, rain: 70, icon: '🌧', condition: 'Rain Expected' },
  { day: 'Thursday', date: '3 Apr', high: 18, low: 10, rain: 85, icon: '⛈', condition: 'Heavy Rain' },
  { day: 'Friday', date: '4 Apr', high: 23, low: 13, rain: 15, icon: '⛅', condition: 'Clearing' },
];

const irrigationAdvisory = [
  { field: 'Field A', crop: 'Maize', today: 'Run', note: 'Normal schedule. Rain Wed may offset future needs.', status: 'ok' },
  { field: 'Field B', crop: 'Tomatoes', today: 'Run - Urgent', note: 'Moisture at 42%. Do not wait for Wednesday rain.', status: 'warn' },
  { field: 'Field C', crop: 'Spinach', today: 'Skip', note: 'Moisture at 74%. Wednesday rain will be sufficient.', status: 'ok' },
  { field: 'Field D', crop: 'Sorghum', today: 'Run - CRITICAL', note: 'Moisture at 28%. Run immediately - 4hrs at 6L/hr.', status: 'alert' },
];

const statusColors = { ok: 'var(--ok)', warn: 'var(--warn)', alert: '#ef4444' };

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchWarning, setFetchWarning] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const apiWeather = await fetchWeather();
        if (mounted) {
          setWeather(apiWeather);
          setFetchWarning('');
        }
      } catch {
        if (mounted) {
          // Keep page usable even if remote weather API fails.
          setWeather(null);
          setFetchWarning('Live weather unavailable. Showing latest local forecast.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const current = weather?.current ?? {
    temp: weatherData?.current?.temp ?? 24,
    humidity: weatherData?.current?.humidity ?? 58,
    wind: weatherData?.current?.wind ?? 12,
    condition: weatherData?.current?.condition ?? 'Partly Cloudy',
    icon: weatherData?.current?.icon ?? '⛅',
    feelsLike: (weatherData?.current?.temp ?? 24) + 2,
    uvIndex: 4,
    visibility: '10+ km',
  };

  const hourlyForecast = weather?.hourlyForecast?.length ? weather.hourlyForecast : fallbackHourlyForecast;
  const extendedForecast = weather?.extendedForecast?.length ? weather.extendedForecast : fallbackExtendedForecast;
  const location = weather?.location ?? 'Gauteng, South Africa';
  const sunrise = weather?.sunrise ?? '05:47';
  const sunset = weather?.sunset ?? '18:05';

  const maxTemp = Math.max(...extendedForecast.map((d) => d.high));

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const heavyRainSummary = useMemo(() => {
    const highRainDays = extendedForecast.filter((d) => d.rain > 60).map((d) => d.day);
    if (!highRainDays.length) {
      return 'No severe rain expected in the next 5 days.';
    }
    return `Heavy rain forecast ${highRainDays.join(', ')} (${Math.max(...extendedForecast.map((d) => d.rain))}%)`;
  }, [extendedForecast]);

  if (loading) {
    return <div style={{ color: 'var(--text-soft)', padding: 32 }}>Loading weather...</div>;
  }

  return (
    <div style={{ padding: isMobile ? '18px 14px' : '28px 32px', width: '100%' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-strong)', margin: 0, marginBottom: 6 }}>
          Weather Intelligence
        </h1>
        <div style={{ fontSize: 14, color: 'var(--text-soft)' }}>
          {location} · Live forecast · AI-adjusted irrigation planning
        </div>
        {fetchWarning && (
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--warn)', fontWeight: 700 }}>{fetchWarning}</div>
        )}
      </div>

      <div
        style={{
          borderRadius: 20,
          padding: isMobile ? '20px 16px' : '32px 36px',
          marginBottom: 24,
          background: 'var(--weather-hero-bg)',
          boxShadow: 'var(--weather-hero-shadow)',
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : '1fr auto',
          gap: isMobile ? 18 : 32,
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: 120, width: 200, height: 200, borderRadius: '50%', background: 'var(--weather-hero-orb-a)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: 40, width: 250, height: 250, borderRadius: '50%', background: 'var(--weather-hero-orb-b)', pointerEvents: 'none' }} />

        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 12, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <div style={{ fontSize: 72, lineHeight: 1 }}>{current.icon}</div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: isMobile ? '2.7rem' : '4rem', color: 'var(--text-strong)', lineHeight: 1 }}>
                {current.temp}
                <span style={{ fontSize: '2rem', color: 'var(--text-soft)', fontWeight: 400 }}> C</span>
              </div>
              <div style={{ fontSize: 16, color: 'var(--text-soft)', marginTop: 4 }}>{current.condition}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-soft)', fontWeight: 600 }}>
            {location} · {formatDate(currentDateTime)} · {formatTime(currentDateTime)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, minWidth: 0 }}>
          {[
            { icon: '💧', label: 'Humidity', val: `${current.humidity}%` },
            { icon: '🌬', label: 'Wind Speed', val: `${current.wind} km/h` },
            { icon: '☀️', label: 'UV Index', val: current.uvIndex ?? '—' },
            { icon: '🌡', label: 'Feels Like', val: `${current.feelsLike ?? current.temp}°C` },
            { icon: '👁', label: 'Visibility', val: current.visibility || '10+ km' },
            { icon: '🌅', label: 'Sunrise', val: sunrise },
            { icon: '🌇', label: 'Sunset', val: sunset },
          ].map((m) => (
            <div key={m.label} style={{ background: 'var(--weather-metric-bg)', borderRadius: 12, padding: '12px 14px', boxShadow: 'inset 0 0 0 1px var(--weather-metric-line)' }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-strong)' }}>{m.val}</div>
              <div style={{ fontSize: 10, color: 'var(--text-soft)', marginTop: 1 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 16 }}>
          Today - Hourly Forecast
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(78px, 1fr))', gap: 8, overflowX: 'auto' }}>
          {hourlyForecast.slice(0, 8).map((h, i) => (
            <div key={h.time} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 12, background: i === 2 ? 'rgba(100,116,139,0.15)' : 'rgba(148,163,184,0.08)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginBottom: 6 }}>{h.time}</div>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{h.icon}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-strong)' }}>{h.temp}</div>
              {h.rain > 0 && <div style={{ fontSize: 10, color: 'var(--text-soft)', marginTop: 4 }}>Rain {h.rain}%</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 20 }}>5-Day Forecast</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowX: isMobile ? 'auto' : 'visible' }}>
            {extendedForecast.map((day, i) => {
              const rainColor = day.rain > 60 ? '#111827' : day.rain > 30 ? '#64748b' : 'var(--text-soft)';
              return (
                <div key={day.day} style={{ display: 'grid', gridTemplateColumns: '90px 30px 1fr 60px 50px', minWidth: isMobile ? 500 : 'auto', alignItems: 'center', gap: 12, padding: '10px 0', boxShadow: i < 4 ? 'inset 0 -1px rgba(100,116,139,0.1)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-strong)' }}>{day.day}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-soft)' }}>{day.date}</div>
                  </div>
                  <div style={{ fontSize: 20 }}>{day.icon}</div>
                  <div>
                    <div style={{ height: 5, background: 'rgba(148,163,184,0.2)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(day.high / maxTemp) * 100}%`, height: '100%', background: 'linear-gradient(90deg, rgba(148,163,184,0.4), #475569)', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-soft)', marginTop: 3 }}>{day.condition}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-strong)' }}>{day.high}</span>
                    <span style={{ color: 'var(--text-soft)' }}> / {day.low}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: rainColor }}>{day.rain}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 4 }}>AI Irrigation Advisory</div>
          <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 16 }}>Based on forecast + current soil moisture</div>
          <div style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 16, background: 'linear-gradient(90deg, rgba(111,155,134,0.2), rgba(111,155,134,0.1))', boxShadow: 'inset 0 0 0 1px rgba(111,155,134,0.22)', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 20 }}>🌧</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-strong)' }}>{heavyRainSummary}</div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2, fontWeight: 600 }}>Adjust irrigation schedules for all fields</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {irrigationAdvisory.map((field) => {
              const col = statusColors[field.status] || '#8a9e8a';
              return (
                <div key={field.field} style={{ padding: '12px 14px', borderRadius: 12, background: `${col}12`, boxShadow: `inset 0 0 0 1px ${col}35`, display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 2 }}>{field.field} - {field.crop}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-soft)', lineHeight: 1.45, fontWeight: 500 }}>{field.note}</div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${col}24`, color: col, whiteSpace: 'nowrap' }}>{field.today}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
