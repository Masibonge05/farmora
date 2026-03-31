import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';

// Keep irrigationAdvisory here — it's farm-specific, not from the API
const irrigationAdvisory = [ /* your existing array */ ];

const statusColors = {
  'Irrigate': '#4a9e4a',
  'Delay': '#e8a020', 
  'Skip': '#80c0f0',
  'Monitor': '#8a9e8a'
};

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Fetch weather data
  useEffect(() => {
    fetchWeather()
      .then(setWeather)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: '#8a9e8a', padding: 32 }}>Loading weather...</div>;
  if (error) return <div style={{ color: '#c85820', padding: 32 }}>Error: {error}</div>;

  // Destructure real API data
  const { current, hourlyForecast, extendedForecast, location, sunrise, sunset } = weather;
  const maxTemp = Math.max(...extendedForecast.map(d => d.high));

  // Format current date and time
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#f0f4f0', margin: 0, marginBottom: 6 }}>
          🌦 Weather Intelligence
        </h1>
        <div style={{ fontSize: 14, color: '#8a9e8a' }}>
          {location || 'Gauteng, South Africa'} · Live forecast · AI-adjusted irrigation planning
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        borderRadius: 20, padding: '32px 36px', marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(30,58,30,0.9) 0%, rgba(20,40,60,0.85) 100%)',
        border: '1px solid rgba(74,158,74,0.2)',
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: 120, width: 200, height: 200, borderRadius: '50%', background: 'rgba(128,192,240,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: 40, width: 250, height: 250, borderRadius: '50%', background: 'rgba(74,158,74,0.05)', pointerEvents: 'none' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 72, lineHeight: 1 }}>{current.icon}</div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '4rem', color: '#f0f4f0', lineHeight: 1 }}>
                {current.temp}°<span style={{ fontSize: '2rem', color: '#8a9e8a', fontWeight: 400 }}>C</span>
              </div>
              <div style={{ fontSize: 16, color: '#8a9e8a', marginTop: 4 }}>{current.condition}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#4a9e4a', fontWeight: 600 }}>
            📍 {location || 'Gauteng, South Africa'} · {formatDate(currentDateTime)} · {formatTime(currentDateTime)}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, minWidth: 280 }}>
          {[
            { icon: '💧', label: 'Humidity', val: `${current.humidity}%` },
            { icon: '🌬', label: 'Wind Speed', val: `${current.wind} km/h` },
            { icon: '☀️', label: 'UV Index', val: current.uvIndex || '—' },
            { icon: '🌡', label: 'Feels Like', val: `${current.feelsLike}°C` },
            { icon: '👁', label: 'Visibility', val: current.visibility || '10+ km' },
            { icon: '🌅', label: 'Sunrise', val: sunrise || '—' },
            { icon: '🌇', label: 'Sunset', val: sunset || '—' },
          ].map(m => (
            <div key={m.label} style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 14px',
              border: '1px solid rgba(74,158,74,0.1)',
            }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#f0f4f0' }}>{m.val}</div>
              <div style={{ fontSize: 10, color: '#8a9e8a', marginTop: 1 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 16 }}>
          Today — Hourly Forecast
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
          {hourlyForecast.slice(0, 8).map((h, i) => (
            <div key={h.time} style={{
              textAlign: 'center', padding: '12px 8px', borderRadius: 12,
              background: i === new Date().getHours() ? 'rgba(74,158,74,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${i === new Date().getHours() ? 'rgba(74,158,74,0.3)' : 'transparent'}`,
            }}>
              <div style={{ fontSize: 11, color: '#8a9e8a', marginBottom: 6 }}>{h.time}</div>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{h.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#f0f4f0' }}>{h.temp}°</div>
              {h.rain > 0 && <div style={{ fontSize: 10, color: '#80c0f0', marginTop: 4 }}>💧 {h.rain}%</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 5-day + advisory */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 20 }}>
            5-Day Forecast
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {extendedForecast.map((day, i) => {
              const rainColor = day.rain > 60 ? '#c85820' : day.rain > 30 ? '#e8a020' : '#80c0f0';
              return (
                <div key={day.day} style={{
                  display: 'grid', gridTemplateColumns: '90px 30px 1fr 60px 50px',
                  alignItems: 'center', gap: 12, padding: '10px 0',
                  borderBottom: i < 4 ? '1px solid rgba(74,158,74,0.08)' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f4f0' }}>{day.day}</div>
                    <div style={{ fontSize: 10, color: '#8a9e8a' }}>{day.date}</div>
                  </div>
                  <div style={{ fontSize: 20 }}>{day.icon}</div>
                  <div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(day.high / maxTemp) * 100}%`, height: '100%', background: 'linear-gradient(90deg, rgba(126,200,126,0.4), #7ec87e)', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 10, color: '#8a9e8a', marginTop: 3 }}>{day.condition}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: '#f0f4f0' }}>{day.high}°</span>
                    <span style={{ color: '#4a6e4a' }}> / {day.low}°</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: rainColor }}>💧{day.rain}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 4 }}>
            💦 AI Irrigation Advisory
          </div>
          <div style={{ fontSize: 12, color: '#8a9e8a', marginBottom: 16 }}>
            Based on forecast + current soil moisture
          </div>
          <div style={{
            padding: '12px 16px', borderRadius: 12, marginBottom: 16,
            background: 'rgba(58,140,200,0.1)', border: '1px solid rgba(58,140,200,0.3)',
            display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <span style={{ fontSize: 20 }}>🌧</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#80c0f0' }}>
                Heavy rain forecast {extendedForecast.slice(0, 3).filter(d => d.rain > 60).map(d => d.day).join(', ')} ({Math.max(...extendedForecast.map(d => d.rain))}%)
              </div>
              <div style={{ fontSize: 11, color: '#8a9e8a', marginTop: 2 }}>
                Adjust irrigation schedules for all fields
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {irrigationAdvisory.map(field => {
              const col = statusColors[field.status] || '#8a9e8a';
              return (
                <div key={field.field} style={{
                  padding: '12px 14px', borderRadius: 12,
                  background: `${col}08`, border: `1px solid ${col}25`,
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-start',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#f0f4f0', marginBottom: 2 }}>{field.field} — {field.crop}</div>
                    <div style={{ fontSize: 11, color: '#8a9e8a', lineHeight: 1.4 }}>{field.note}</div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                    background: `${col}20`, color: col, whiteSpace: 'nowrap', border: `1px solid ${col}40`,
                  }}>{field.today}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}