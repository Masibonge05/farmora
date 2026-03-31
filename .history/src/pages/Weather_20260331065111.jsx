import { weatherData } from '../data/dummyData';
import useMediaQuery from '../lib/useMediaQuery';

const hourlyForecast = [
  { time: '06:00', temp: 17, icon: 'CL', rain: 5 },
  { time: '08:00', temp: 19, icon: 'SU', rain: 5 },
  { time: '10:00', temp: 22, icon: 'SU', rain: 0 },
  { time: '12:00', temp: 24, icon: 'SU', rain: 0 },
  { time: '14:00', temp: 26, icon: 'SU', rain: 0 },
  { time: '16:00', temp: 25, icon: 'CL', rain: 10 },
  { time: '18:00', temp: 22, icon: 'RN', rain: 15 },
  { time: '20:00', temp: 19, icon: 'CL', rain: 5 },
];

const extendedForecast = [
  { day: 'Monday',    date: '31 Mar', high: 26, low: 14, rain: 10, icon: 'SU', condition: 'Mostly Sunny',  humidity: 52, wind: 10 },
  { day: 'Tuesday',   date: '1 Apr',  high: 24, low: 13, rain: 25, icon: 'CL', condition: 'Partly Cloudy', humidity: 60, wind: 14 },
  { day: 'Wednesday', date: '2 Apr',  high: 21, low: 12, rain: 70, icon: 'RN', condition: 'Rain Expected', humidity: 78, wind: 18 },
  { day: 'Thursday',  date: '3 Apr',  high: 18, low: 10, rain: 85, icon: 'RN', condition: 'Heavy Rain',    humidity: 88, wind: 22 },
  { day: 'Friday',    date: '4 Apr',  high: 23, low: 13, rain: 15, icon: 'CL', condition: 'Clearing',      humidity: 55, wind: 12 },
];

const irrigationAdvisory = [
  { field: 'Field A', crop: 'Maize',    today: 'Run',            note: 'Normal schedule. Rain Wed may offset future needs.',         status: 'ok'    },
  { field: 'Field B', crop: 'Tomatoes', today: 'Run - Urgent',   note: 'Moisture at 42%. Do not wait for Wednesday rain.',           status: 'warn'  },
  { field: 'Field C', crop: 'Spinach',  today: 'Skip',           note: 'Moisture at 74%. Wednesday rain will be sufficient.',        status: 'ok'    },
  { field: 'Field D', crop: 'Sorghum',  today: 'Run - CRITICAL', note: 'Moisture at 28%. Run immediately - 4hrs at 6L/hr.',         status: 'alert' },
];

const statusColors = { ok: 'var(--ok)', warn: 'var(--warn)', alert: '#ef4444' };

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
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');

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
    <div style={{ padding: isMobile ? '18px 14px' : '28px 32px', width: '100%' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-strong)', margin: 0, marginBottom: 6 }}>
           Weather Intelligence
        </h1>
        <div style={{ fontSize: 14, color: 'var(--text-soft)' }}>
          Gauteng, South Africa - Live forecast - AI-adjusted irrigation planning
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        borderRadius: 20, padding: isMobile ? '20px 16px' : '32px 36px', marginBottom: 24,
        background: 'var(--weather-hero-bg)',
        boxShadow: 'var(--weather-hero-shadow)',
        display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr auto', gap: isMobile ? 18 : 32, alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: 120, width: 200, height: 200, borderRadius: '50%', background: 'var(--weather-hero-orb-a)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: 40, width: 250, height: 250, borderRadius: '50%', background: 'var(--weather-hero-orb-b)', pointerEvents: 'none' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 12, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <div style={{ fontSize: 72, lineHeight: 1 }}>{current.icon}</div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: isMobile ? '2.7rem' : '4rem', color: 'var(--text-strong)', lineHeight: 1 }}>
                {current.temp}<span style={{ fontSize: '2rem', color: 'var(--text-soft)', fontWeight: 400 }}> C</span>
              </div>
              <div style={{ fontSize: 16, color: 'var(--text-soft)', marginTop: 4 }}>{current.condition}</div>
            </div>
          </div>
<<<<<<< HEAD
          <div style={{ fontSize: 13, color: 'var(--text-soft)', fontWeight: 600 }}>Gauteng, South Africa - Monday 30 March 2026</div>
=======
          <div style={{ fontSize: 13, color: '#4a9e4a', fontWeight: 600 }}>
            📍 {location || 'Gauteng, South Africa'} · {formatDate(currentDateTime)} · {formatTime(currentDateTime)}
          </div>
>>>>>>> a54300783fad36a4589c72ac3b36a4e7c5f70b39
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, minWidth: 0 }}>
          {[
<<<<<<< HEAD
            { icon: 'H', label: 'Humidity',   val: `${current.humidity}%` },
            { icon: 'W', label: 'Wind Speed', val: `${current.wind} km/h` },
            { icon: 'U', label: 'UV Index',   val: '4 - Moderate' },
            { icon: 'F', label: 'Feels Like', val: `${current.temp + 2}C` },
            { icon: 'V', label: 'Visibility', val: '10+ km' },
            { icon: 'S', label: 'Sunrise',    val: '05:47' },
=======
            { icon: '💧', label: 'Humidity', val: `${current.humidity}%` },
            { icon: '🌬', label: 'Wind Speed', val: `${current.wind} km/h` },
            { icon: '☀️', label: 'UV Index', val: current.uvIndex || '—' },
            { icon: '🌡', label: 'Feels Like', val: `${current.feelsLike}°C` },
            { icon: '👁', label: 'Visibility', val: current.visibility || '10+ km' },
            { icon: '🌅', label: 'Sunrise', val: sunrise || '—' },
            { icon: '🌇', label: 'Sunset', val: sunset || '—' },
>>>>>>> a54300783fad36a4589c72ac3b36a4e7c5f70b39
          ].map(m => (
            <div key={m.label} style={{
              background: 'var(--weather-metric-bg)', borderRadius: 12, padding: '12px 14px',
              boxShadow: 'inset 0 0 0 1px var(--weather-metric-line)',
            }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-strong)' }}>{m.val}</div>
              <div style={{ fontSize: 10, color: 'var(--text-soft)', marginTop: 1 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
<<<<<<< HEAD
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 16 }}>Today - Hourly</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(78px, 1fr))', gap: 8, overflowX: 'auto' }}>
          {hourlyForecast.map((h, i) => (
            <div key={h.time} style={{
              textAlign: 'center', padding: '12px 8px', borderRadius: 12,
              background: i === 3 ? 'rgba(100,116,139,0.15)' : 'rgba(148,163,184,0.08)',
              boxShadow: i === 3 ? 'inset 0 0 0 1px rgba(100,116,139,0.35)' : 'none',
=======
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 16 }}>
          Today — Hourly Forecast
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
          {hourlyForecast.slice(0, 8).map((h, i) => (
            <div key={h.time} style={{
              textAlign: 'center', padding: '12px 8px', borderRadius: 12,
              background: i === new Date().getHours() ? 'rgba(74,158,74,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${i === new Date().getHours() ? 'rgba(74,158,74,0.3)' : 'transparent'}`,
>>>>>>> a54300783fad36a4589c72ac3b36a4e7c5f70b39
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginBottom: 6 }}>{h.time}</div>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{h.icon}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-strong)' }}>{h.temp}</div>
              {h.rain > 0 && <div style={{ fontSize: 10, color: '#8fbda8', marginTop: 4 }}>Rain {h.rain}%</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 5-day + advisory */}
      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: '20px 24px' }}>
<<<<<<< HEAD
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 20 }}>5-Day Forecast</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowX: isMobile ? 'auto' : 'visible' }}>
=======
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 20 }}>
            5-Day Forecast
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
>>>>>>> a54300783fad36a4589c72ac3b36a4e7c5f70b39
            {extendedForecast.map((day, i) => {
              const rainColor = day.rain > 60 ? '#111827' : day.rain > 30 ? '#64748b' : '#8fbda8';
              return (
                <div key={day.day} style={{
                  display: 'grid', gridTemplateColumns: '90px 30px 1fr 60px 50px',
                  minWidth: isMobile ? 500 : 'auto',
                  alignItems: 'center', gap: 12, padding: '10px 0',
                  boxShadow: i < 4 ? 'inset 0 -1px rgba(100,116,139,0.1)' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-strong)' }}>{day.day}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-soft)' }}>{day.date}</div>
                  </div>
                  <div style={{ fontSize: 20 }}>{day.icon}</div>
                  <div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
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
<<<<<<< HEAD
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 4 }}>AI Irrigation Advisory</div>
          <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 16 }}>Based on forecast + current soil moisture</div>
=======
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 4 }}>
            💦 AI Irrigation Advisory
          </div>
          <div style={{ fontSize: 12, color: '#8a9e8a', marginBottom: 16 }}>
            Based on forecast + current soil moisture
          </div>
>>>>>>> a54300783fad36a4589c72ac3b36a4e7c5f70b39
          <div style={{
            padding: '12px 16px', borderRadius: 12, marginBottom: 16,
            background: 'linear-gradient(90deg, rgba(111,155,134,0.2), rgba(111,155,134,0.1))',
            boxShadow: 'inset 0 0 0 1px rgba(111,155,134,0.22)',
            display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <span style={{ fontSize: 20 }}>RN</span>
            <div>
<<<<<<< HEAD
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-strong)' }}>Heavy rain forecast Wed-Thu (70-85%)</div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2, fontWeight: 600 }}>Adjust irrigation schedules for all fields</div>
=======
              <div style={{ fontSize: 12, fontWeight: 700, color: '#80c0f0' }}>
                Heavy rain forecast {extendedForecast.slice(0, 3).filter(d => d.rain > 60).map(d => d.day).join(', ')} ({Math.max(...extendedForecast.map(d => d.rain))}%)
              </div>
              <div style={{ fontSize: 11, color: '#8a9e8a', marginTop: 2 }}>
                Adjust irrigation schedules for all fields
              </div>
>>>>>>> a54300783fad36a4589c72ac3b36a4e7c5f70b39
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {irrigationAdvisory.map(field => {
              const col = statusColors[field.status] || '#8a9e8a';
              return (
                <div key={field.field} style={{
                  padding: '12px 14px', borderRadius: 12,
                  background: `${col}12`,
                  boxShadow: `inset 0 0 0 1px ${col}35`,
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-start',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 2 }}>{field.field} - {field.crop}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-soft)', lineHeight: 1.45, fontWeight: 500 }}>{field.note}</div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                    background: `${col}24`, color: col, whiteSpace: 'nowrap',
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


