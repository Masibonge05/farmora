import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { farmFields, soilMetrics, yieldForecast, alerts, weatherData, marketPrices } from '../data/dummyData';
import useMediaQuery from '../lib/useMediaQuery';

const statusColor = { healthy: '#b8924a', warning: '#e8a020', alert: '#ef4444' };
const statusLabel = { healthy: 'Healthy', warning: 'Warning', alert: 'Alert' };

function MetricCard({ label, value, unit, sub, icon, color = '#b8924a', delay = 0, pulse = false }) {
  return (
    <div className="card" style={{ padding: '18px 20px', animationDelay: `${delay}ms`, position: 'relative', overflow: 'hidden' }}>
      {pulse && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 16,
          background: 'rgba(200,88,32,0.06)',
          animation: 'pulse-card 2s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
      <style>{`@keyframes pulse-card { 0%,100%{opacity:0} 50%{opacity:1} }`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ fontSize: 20 }}>{icon}</div>
      </div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.9rem', color, lineHeight: 1 }}>
        {value}<span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748b', marginLeft: 4 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 12, color: pulse ? '#e8a020' : '#64748b', marginTop: 6 }}>{sub}</div>
    </div>
  );
}

function FieldCard({ field }) {
  const col = statusColor[field.status];
  return (
    <div className="card" style={{ padding: '16px 18px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{field.name}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{field.location}  {field.hectares} ha</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="status-dot" style={{ background: col }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: col }}>{statusLabel[field.status]}</span>
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#64748b' }}>NDVI Health Index</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{(field.ndvi * 100).toFixed(0)}%</span>
        </div>
        <div style={{ height: 5, background: '#f1f5f9', borderRadius: 4 }}>
          <div style={{ width: `${field.ndvi * 100}%`, height: '100%', background: col, borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#64748b' }}>Soil Moisture</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: field.moisture < 40 ? '#ef4444' : '#3b82f6' }}>{field.moisture}%</span>
        </div>
        <div style={{ height: 5, background: '#f1f5f9', borderRadius: 4 }}>
          <div style={{ width: `${field.moisture}%`, height: '100%', background: '#3b82f6', borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 10, color: '#64748b' }}>Last scan: {field.lastScan}</div>
    </div>
  );
}

function FarmoraCard({ onNav }) {
  return (
    <div
      className="card"
      onClick={() => onNav?.('farmora-ai')}
      style={{
        padding: '18px 18px',
        cursor: 'pointer',
        border: '1px solid #e2e8f0',
        background: 'linear-gradient(135deg, rgba(34,197,94,0.05), rgba(134,239,172,0.02))',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fcf7ed',
            color: '#8d6b33',
            fontSize: 18,
            border: '1px solid #c9a766',
            borderRadius: 8
          }}
        >
          
        </div>
        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 15, color: '#1e293b' }}>
            Ask Farmora AI
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
            Multilingual crop analysis
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginBottom: 12 }}>
        Upload a crop image, ask a farming question, or use audio to get location-aware AI guidance.
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '5px 8px',
              borderRadius: 999,
              background: '#f8fafc',
              color: '#b8924a',
            }}
          >
            AI Chat
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '5px 8px',
              borderRadius: 999,
              background: '#f8fafc',
              color: '#3b82f6',
            }}
          >
            Voice
          </span>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: '#b8924a' }}>
          Open 
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
        <div style={{ color: '#1e293b', fontWeight: 700, marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, display: 'flex', gap: 8, marginBottom: 2 }}>
            <span>{p.name}:</span><span style={{ fontWeight: 700 }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Overview({ onNav }) {
  const totalHectares = farmFields.reduce((s, f) => s + f.hectares, 0);
  const healthyCount = farmFields.filter(f => f.status === 'healthy').length;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');

  return (
    <div style={{ padding: isMobile ? '18px 14px' : '28px 32px', maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 22 }}></span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Farm Overview</h1>
        </div>
        <div style={{ fontSize: 14, color: '#64748b' }}>
          Monday, 30 March 2026  <span style={{ color: '#b8924a' }}>All sensors online</span>
          <span className="status-dot status-ok" style={{ marginLeft: 8 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Area" value={totalHectares.toFixed(1)} unit="ha" sub="4 active fields" icon="" color="#b8924a" delay={0} />
        <MetricCard label="Healthy Fields" value={healthyCount} unit={`/${farmFields.length}`} sub="2 need attention" icon="" color="#b8924a" delay={50} />
        <MetricCard label="Avg Moisture" value="53" unit="%" sub=" Field D critical" icon="" color="#3b82f6" delay={100} />
        <MetricCard label="Active Alerts" value="2" unit="" sub="1 critical  act now" icon="" color="#e8a020" delay={150} pulse />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1e293b' }}>Soil Moisture  Today</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Field A (Maize)  ESP32 sensor network</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={soilMetrics}>
              <defs>
                <linearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3a8cc8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3a8cc8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[30, 80]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="moisture" name="Moisture %" stroke="#3a8cc8" fill="url(#moistGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1f2937' }}>Yield Forecast</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Tonnes/hectare  AI prediction model</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={yieldForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} domain={[1.5, 4.5]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#b8924a" strokeWidth={2.5} dot={{ fill: '#b8924a', r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="#e8a020" strokeWidth={2} strokeDasharray="5 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 280px', gap: 20 }}>
        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 12 }}>Field Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {farmFields.map(f => <FieldCard key={f.id} field={f} />)}
            <FarmoraCard onNav={onNav} />
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 12 }}>Recent Alerts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map(alert => {
              const borderCol = alert.type === 'alert' ? '#c85820' : alert.type === 'warning' ? '#e8a020' : alert.type === 'success' ? '#b8924a' : '#3a8cc8';
              return (
                <div
                  key={alert.id}
                  className="card"
                  onClick={() => onNav?.('alerts')}
                  style={{ padding: '14px 16px', borderLeft: `3px solid ${borderCol}`, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 20 }}>{alert.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', marginBottom: 3 }}>{alert.field}</div>
                      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{alert.message}</div>
                      <div style={{ fontSize: 10, color: '#8d6b33', marginTop: 6 }}>{alert.time}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              onClick={() => onNav?.('alerts')}
              style={{ fontSize: 12, color: '#9d7a3d', cursor: 'pointer', textAlign: 'center', padding: '8px', fontWeight: 600 }}
            >
              View all alerts 
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 12 }}>Weather</div>
          <div
            className="card"
            onClick={() => onNav?.('weather')}
            style={{ padding: '20px', marginBottom: 10, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 40 }}>{weatherData.current.icon}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.2rem', color: '#1e293b', lineHeight: 1 }}>
                {weatherData.current.temp}C
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{weatherData.current.condition}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(184,146,74,0.1)' }}>
              {[
                { icon: '', val: `${weatherData.current.humidity}%`, label: 'Humidity' },
                { icon: '', val: `${weatherData.current.wind}km/h`, label: 'Wind' },
                { icon: '', val: 'UV 4', label: 'Index' },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16 }}>{m.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1f2937' }}>{m.val}</div>
                  <div style={{ fontSize: 10, color: '#6b7280' }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: '#9d7a3d', fontWeight: 600 }}>
              Tap for full forecast 
            </div>
          </div>
          {weatherData.forecast.map(f => (
            <div key={f.day} className="card" style={{ padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{f.icon}</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{f.day}</span>
              </div>
              <div style={{ fontSize: 11, color: '#3a8cc8' }}> {f.rain}</div>
              <div style={{ fontSize: 12, color: '#1e293b', fontWeight: 600 }}>{f.high} / {f.low}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 12 }}>
          Live Market Prices <span className="chip chip-green" style={{ marginLeft: 8, verticalAlign: 'middle' }}>Live</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14 }}>
          {marketPrices.map(m => (
            <div key={m.crop} className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 2 }}>{m.crop}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#1f2937' }}>{m.price}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{m.unit}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: m.trend === 'up' ? '#b8924a' : '#c85820' }}>
                  {m.trend === 'up' ? '' : ''} {m.change}
                </span>
                <span style={{ fontSize: 11, color: '#9d7a3d' }}>{m.buyers} buyers</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


