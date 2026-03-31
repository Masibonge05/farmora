import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { farmFields, soilMetrics, yieldForecast, alerts, weatherData, marketPrices } from '../data/dummyData';
import useMediaQuery from '../lib/useMediaQuery';

const statusColor = { healthy: '#475569', warning: '#64748b', alert: '#1f2937' };
const statusLabel = { healthy: 'Healthy', warning: 'Warning', alert: 'Alert' };

function MetricCard({ label, value, unit, sub, icon, color = '#475569', delay = 0, pulse = false }) {
  return (
    <div className="card kpi-card" style={{ padding: '18px 20px', animationDelay: `${delay}ms`, position: 'relative', overflow: 'hidden' }}>
      {pulse && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 16,
          background: 'rgba(31,41,55,0.06)',
          animation: 'pulse-card 2s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
      <style>{`@keyframes pulse-card { 0%,100%{opacity:0} 50%{opacity:1} }`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--text-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        <div style={{ fontSize: 20 }}>{icon}</div>
      </div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.9rem', color, lineHeight: 1 }}>
        {value}<span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-soft)', marginLeft: 4 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 6 }}>{sub}</div>
    </div>
  );
}

function FieldCard({ field }) {
  const col = statusColor[field.status];
  return (
    <div className="card" style={{ padding: '16px 18px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-strong)' }}>{field.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2 }}>{field.location}  {field.hectares} ha</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="status-dot" style={{ background: col }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: col }}>{statusLabel[field.status]}</span>
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-soft)' }}>NDVI Health Index</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{(field.ndvi * 100).toFixed(0)}%</span>
        </div>
        <div style={{ height: 5, background: '#f1f5f9', borderRadius: 4 }}>
          <div style={{ width: `${field.ndvi * 100}%`, height: '100%', background: col, borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-soft)' }}>Soil Moisture</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: field.moisture < 40 ? '#1f2937' : '#6f9b86' }}>{field.moisture}%</span>
        </div>
        <div style={{ height: 5, background: '#f1f5f9', borderRadius: 4 }}>
          <div style={{ width: `${field.moisture}%`, height: '100%', background: '#6f9b86', borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text-soft)' }}>Last scan: {field.lastScan}</div>
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
        background: 'linear-gradient(135deg, rgba(100,116,139,0.1), rgba(217,191,138,0.04))',
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
            background: '#f8fafc',
            color: '#334155',
            fontSize: 18,
            borderRadius: 8
          }}
        >
          AI
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
              color: '#475569',
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
              color: '#6f9b86',
            }}
          >
            Voice
          </span>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
          Open now
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#ffffff', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: '0 10px 24px rgba(15,23,42,0.12)' }}>
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
    <div className="dashboard-frame" style={{ padding: isMobile ? '18px 14px' : '28px 32px', width: '100%' }}>
      <div className="dashboard-hero" style={{ marginBottom: 22 }}>
        <div className="section-kicker" style={{ marginBottom: 6 }}>Operations Overview</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--control-text)', borderRadius: 999, padding: '2px 8px', background: 'var(--control-bg)', boxShadow: '0 4px 10px rgba(15,23,42,0.08)' }}>OV</span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.72rem', fontWeight: 800, color: 'var(--text-strong)', margin: 0 }}>Farm Overview</h1>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-soft)' }}>
          Monday, 30 March 2026 - <span style={{ color: 'var(--accent-2)', fontWeight: 700 }}>All sensors online</span>
          <span className="status-dot status-ok" style={{ marginLeft: 8 }} />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {[
            { label: 'View Alerts', page: 'alerts' },
            { label: 'Check Weather', page: 'weather' },
            { label: 'Open Market', page: 'market' },
            { label: 'Ask AI', page: 'farmora-ai' },
          ].map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => onNav?.(item.page)}
              className="top-shortcut"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Area" value={totalHectares.toFixed(1)} unit="ha" sub="4 active fields" icon="A" color="#475569" delay={0} />
        <MetricCard label="Healthy Fields" value={healthyCount} unit={`/${farmFields.length}`} sub="2 need attention" icon="H" color="#475569" delay={50} />
        <MetricCard label="Avg Moisture" value="53" unit="%" sub="Field D critical" icon="M" color="#6f9b86" delay={100} />
        <MetricCard label="Active Alerts" value="2" unit="" sub="1 critical - act now" icon="!" color="#64748b" delay={150} pulse />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-kicker" style={{ marginBottom: 4 }}>Live Moisture</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)' }}>Soil Moisture - Today</div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>Field A (Maize) - ESP32 sensor network</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={soilMetrics}>
              <defs>
                <linearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6f9b86" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6f9b86" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[30, 80]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="moisture" name="Moisture %" stroke="#6f9b86" fill="url(#moistGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-kicker" style={{ marginBottom: 4 }}>AI Projection</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)' }}>Yield Forecast</div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>Tonnes/hectare - AI prediction model</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={yieldForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} domain={[1.5, 4.5]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#475569" strokeWidth={2.5} dot={{ fill: '#475569', r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="#64748b" strokeWidth={2} strokeDasharray="5 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 280px', gap: 20 }}>
        <div>
          <div className="section-kicker" style={{ marginBottom: 6 }}>Production Fields</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 12 }}>Field Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {farmFields.map(f => <FieldCard key={f.id} field={f} />)}
            <FarmoraCard onNav={onNav} />
          </div>
        </div>

        <div>
          <div className="section-kicker" style={{ marginBottom: 6 }}>Attention Queue</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 12 }}>Recent Alerts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map(alert => {
              const borderCol = alert.type === 'alert' ? '#111827' : alert.type === 'warning' ? '#64748b' : alert.type === 'success' ? '#475569' : '#6f9b86';
              return (
                <div
                  key={alert.id}
                  className="card"
                  onClick={() => onNav?.('alerts')}
                  style={{
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: `linear-gradient(90deg, ${borderCol}20 0%, ${borderCol}08 9%, transparent 36%)`,
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 20 }}>{alert.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 3 }}>{alert.field}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.4 }}>{alert.message}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-soft)', marginTop: 6 }}>{alert.time}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              onClick={() => onNav?.('alerts')}
              style={{ fontSize: 12, color: '#64748b', cursor: 'pointer', textAlign: 'center', padding: '8px', fontWeight: 600 }}
            >
              View all alerts 
            </div>
          </div>
        </div>

        <div>
          <div className="section-kicker" style={{ marginBottom: 6 }}>Climate Snapshot</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 12 }}>Weather</div>
          <div
            className="card"
            onClick={() => onNav?.('weather')}
            style={{ padding: '20px', marginBottom: 10, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 40 }}>{weatherData.current.icon}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.2rem', color: 'var(--text-strong)', lineHeight: 1 }}>
                {weatherData.current.temp}C
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 4 }}>{weatherData.current.condition}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12, paddingTop: 12 }}>
              {[
                { icon: 'H', val: `${weatherData.current.humidity}%`, label: 'Humidity' },
                { icon: 'W', val: `${weatherData.current.wind}km/h`, label: 'Wind' },
                { icon: 'U', val: 'UV 4', label: 'Index' },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16 }}>{m.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-strong)' }}>{m.val}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-soft)' }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'var(--text-soft)', fontWeight: 600 }}>
              Tap for full forecast 
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="section-kicker" style={{ marginBottom: 6 }}>Commerce</div>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 12 }}>
          Live Market Prices <span className="chip chip-green" style={{ marginLeft: 8, verticalAlign: 'middle' }}>Live</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14 }}>
          {marketPrices.map(m => (
            <div key={m.crop} className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 2 }}>{m.crop}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-strong)' }}>{m.price}</div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginBottom: 6 }}>{m.unit}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: m.trend === 'up' ? '#475569' : '#111827' }}>
                  {m.trend === 'up' ? '+' : '-'} {m.change}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-soft)' }}>{m.buyers} buyers</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


