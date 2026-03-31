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

const statusColors = { ok: '#b8924a', warn: '#e8a020', alert: '#c85820' };

export default function Weather() {
  const { current } = weatherData;
  const maxTemp = Math.max(...extendedForecast.map(d => d.high));
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');

  return (
    <div style={{ padding: isMobile ? '18px 14px' : '28px 32px', maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#1f2937', margin: 0, marginBottom: 6 }}>
           Weather Intelligence
        </h1>
        <div style={{ fontSize: 14, color: '#6b7280' }}>
          Gauteng, South Africa - Live forecast - AI-adjusted irrigation planning
        </div>
      </div>

      {/* Hero */}
      <div style={{
        borderRadius: 20, padding: isMobile ? '20px 16px' : '32px 36px', marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(252,247,237,0.96) 0%, rgba(241,234,217,0.95) 100%)',
        border: '1px solid rgba(184,146,74,0.2)',
        display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr auto', gap: isMobile ? 18 : 32, alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: 120, width: 200, height: 200, borderRadius: '50%', background: 'rgba(128,192,240,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: 40, width: 250, height: 250, borderRadius: '50%', background: 'rgba(184,146,74,0.05)', pointerEvents: 'none' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 12, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <div style={{ fontSize: 72, lineHeight: 1 }}>{current.icon}</div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: isMobile ? '2.7rem' : '4rem', color: '#1f2937', lineHeight: 1 }}>
                {current.temp}<span style={{ fontSize: '2rem', color: '#6b7280', fontWeight: 400 }}> C</span>
              </div>
              <div style={{ fontSize: 16, color: '#6b7280', marginTop: 4 }}>{current.condition}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#9d7a3d', fontWeight: 600 }}>Gauteng, South Africa - Monday 30 March 2026</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, minWidth: 0 }}>
          {[
            { icon: 'H', label: 'Humidity',   val: `${current.humidity}%` },
            { icon: 'W', label: 'Wind Speed', val: `${current.wind} km/h` },
            { icon: 'U', label: 'UV Index',   val: '4 - Moderate' },
            { icon: 'F', label: 'Feels Like', val: `${current.temp + 2}C` },
            { icon: 'V', label: 'Visibility', val: '10+ km' },
            { icon: 'S', label: 'Sunrise',    val: '05:47' },
          ].map(m => (
            <div key={m.label} style={{
              background: 'rgba(148,163,184,0.1)', borderRadius: 12, padding: '12px 14px',
              border: '1px solid rgba(184,146,74,0.1)',
            }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1f2937' }}>{m.val}</div>
              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1f2937', marginBottom: 16 }}>Today - Hourly</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(78px, 1fr))', gap: 8, overflowX: 'auto' }}>
          {hourlyForecast.map((h, i) => (
            <div key={h.time} style={{
              textAlign: 'center', padding: '12px 8px', borderRadius: 12,
              background: i === 3 ? 'rgba(184,146,74,0.15)' : 'rgba(148,163,184,0.08)',
              border: `1px solid ${i === 3 ? 'rgba(184,146,74,0.3)' : 'transparent'}`,
            }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>{h.time}</div>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{h.icon}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: '#1f2937' }}>{h.temp}</div>
              {h.rain > 0 && <div style={{ fontSize: 10, color: '#80c0f0', marginTop: 4 }}>Rain {h.rain}%</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 5-day + advisory */}
      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1f2937', marginBottom: 20 }}>5-Day Forecast</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowX: isMobile ? 'auto' : 'visible' }}>
            {extendedForecast.map((day, i) => {
              const rainColor = day.rain > 60 ? '#c85820' : day.rain > 30 ? '#e8a020' : '#80c0f0';
              return (
                <div key={day.day} style={{
                  display: 'grid', gridTemplateColumns: '90px 30px 1fr 60px 50px',
                  minWidth: isMobile ? 500 : 'auto',
                  alignItems: 'center', gap: 12, padding: '10px 0',
                  borderBottom: i < 4 ? '1px solid rgba(184,146,74,0.08)' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1f2937' }}>{day.day}</div>
                    <div style={{ fontSize: 10, color: '#6b7280' }}>{day.date}</div>
                  </div>
                  <div style={{ fontSize: 20 }}>{day.icon}</div>
                  <div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(day.high / maxTemp) * 100}%`, height: '100%', background: 'linear-gradient(90deg, rgba(201,167,102,0.4), #b8924a)', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 10, color: '#6b7280', marginTop: 3 }}>{day.condition}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: '#1f2937' }}>{day.high}</span>
                    <span style={{ color: '#8d6b33' }}> / {day.low}</span>
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
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1f2937', marginBottom: 4 }}>AI Irrigation Advisory</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>Based on forecast + current soil moisture</div>
          <div style={{
            padding: '12px 16px', borderRadius: 12, marginBottom: 16,
            background: 'rgba(58,140,200,0.1)', border: '1px solid rgba(58,140,200,0.3)',
            display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <span style={{ fontSize: 20 }}>RN</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#80c0f0' }}>Heavy rain forecast Wed-Thu (70-85%)</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Adjust irrigation schedules for all fields</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {irrigationAdvisory.map(field => {
              const col = statusColors[field.status];
              return (
                <div key={field.field} style={{
                  padding: '12px 14px', borderRadius: 12,
                  background: `${col}08`, border: `1px solid ${col}25`,
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-start',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1f2937', marginBottom: 2 }}>{field.field} - {field.crop}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.4 }}>{field.note}</div>
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


