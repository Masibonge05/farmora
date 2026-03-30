import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Droplets, Thermometer, Wind, AlertTriangle, CheckCircle, Leaf } from 'lucide-react';
import { farmFields, soilMetrics, yieldForecast, alerts, weatherData, marketPrices } from '../data/dummyData';

const statusColor = { healthy: '#7ec87e', warning: '#e8a020', alert: '#c85820' };
const statusLabel = { healthy: 'Healthy', warning: 'Warning', alert: 'Alert' };

function MetricCard({ label, value, unit, sub, icon, color = '#7ec87e', delay = 0 }) {
  return (
    <div className="card" style={{ padding: '18px 20px', animationDelay: `${delay}ms` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: '#8a9e8a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ fontSize: 20 }}>{icon}</div>
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.9rem', color, lineHeight: 1 }}>
        {value}<span style={{ fontSize: '1rem', fontWeight: 500, color: '#8a9e8a', marginLeft: 4 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 12, color: '#4a9e4a', marginTop: 6 }}>{sub}</div>
    </div>
  );
}

function FieldCard({ field }) {
  const col = statusColor[field.status];
  return (
    <div className="card" style={{ padding: '16px 18px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#f0f4f0' }}>{field.name}</div>
          <div style={{ fontSize: 11, color: '#8a9e8a', marginTop: 2 }}>{field.location} · {field.hectares} ha</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="status-dot" style={{ background: col, boxShadow: `0 0 8px ${col}` }}></span>
          <span style={{ fontSize: 11, fontWeight: 600, color: col }}>{statusLabel[field.status]}</span>
        </div>
      </div>
      
      {/* NDVI bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#8a9e8a' }}>NDVI Health Index</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{(field.ndvi * 100).toFixed(0)}%</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
          <div style={{ width: `${field.ndvi * 100}%`, height: '100%', background: `linear-gradient(90deg, ${col}60, ${col})`, borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
      </div>

      {/* Moisture */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#8a9e8a' }}>Soil Moisture</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: field.moisture < 40 ? '#c85820' : '#80c0f0' }}>{field.moisture}%</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
          <div style={{ width: `${field.moisture}%`, height: '100%', background: `linear-gradient(90deg, #3a8cc860, #80c0f0)`, borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 10, color: '#4a6e4a' }}>Last scan: {field.lastScan}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'rgba(15,26,15,0.95)', border: '1px solid rgba(74,158,74,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
        <div style={{ color: '#7ec87e', fontWeight: 700, marginBottom: 6 }}>{label}</div>
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

export default function Overview() {
  const totalHectares = farmFields.reduce((s, f) => s + f.hectares, 0);
  const healthyCount = farmFields.filter(f => f.status === 'healthy').length;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 22 }}>🌾</span>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#f0f4f0', margin: 0 }}>Farm Overview</h1>
        </div>
        <div style={{ fontSize: 14, color: '#8a9e8a' }}>
          Monday, 30 March 2026 · <span style={{ color: '#4a9e4a' }}>All sensors online</span>
          <span className="status-dot status-ok" style={{ marginLeft: 8 }}></span>
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Area" value={totalHectares.toFixed(1)} unit="ha" sub="4 active fields" icon="🌍" color="#7ec87e" delay={0} />
        <MetricCard label="Healthy Fields" value={healthyCount} unit={`/${farmFields.length}`} sub="2 need attention" icon="🌱" color="#7ec87e" delay={50} />
        <MetricCard label="Avg Moisture" value="53" unit="%" sub="↓ Field D critical" icon="💧" color="#80c0f0" delay={100} />
        <MetricCard label="Active Alerts" value="2" unit="" sub="1 critical, 1 warning" icon="⚠️" color="#e8a020" delay={150} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Soil moisture chart */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0' }}>Soil Moisture — Today</div>
            <div style={{ fontSize: 12, color: '#8a9e8a' }}>Field A (Maize) · ESP32 sensor network</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={soilMetrics}>
              <defs>
                <linearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3a8cc8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3a8cc8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[30, 80]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="moisture" name="Moisture %" stroke="#3a8cc8" fill="url(#moistGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Yield forecast */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0' }}>Yield Forecast</div>
            <div style={{ fontSize: 12, color: '#8a9e8a' }}>Tonnes/hectare · AI prediction model</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={yieldForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[1.5, 4.5]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#7ec87e" strokeWidth={2.5} dot={{ fill: '#7ec87e', r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="#e8a020" strokeWidth={2} strokeDasharray="5 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fields + Alerts + Weather */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 20 }}>
        {/* Fields */}
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 12 }}>Field Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {farmFields.map(f => <FieldCard key={f.id} field={f} />)}
          </div>
        </div>

        {/* Alerts */}
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 12 }}>Recent Alerts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map(alert => {
              const borderCol = alert.type === 'alert' ? '#c85820' : alert.type === 'warning' ? '#e8a020' : alert.type === 'success' ? '#7ec87e' : '#3a8cc8';
              return (
                <div key={alert.id} className="card" style={{ padding: '14px 16px', borderLeft: `3px solid ${borderCol}` }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 20 }}>{alert.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f4f0', marginBottom: 3 }}>{alert.field}</div>
                      <div style={{ fontSize: 12, color: '#8a9e8a', lineHeight: 1.4 }}>{alert.message}</div>
                      <div style={{ fontSize: 10, color: '#4a6e4a', marginTop: 6 }}>{alert.time}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weather */}
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 12 }}>Weather</div>
          <div className="card" style={{ padding: '20px', marginBottom: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 40 }}>{weatherData.current.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2.2rem', color: '#f0f4f0', lineHeight: 1 }}>
                {weatherData.current.temp}°C
              </div>
              <div style={{ fontSize: 13, color: '#8a9e8a', marginTop: 4 }}>{weatherData.current.condition}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(74,158,74,0.1)' }}>
              {[
                { icon: '💧', val: `${weatherData.current.humidity}%`, label: 'Humidity' },
                { icon: '🌬', val: `${weatherData.current.wind}km/h`, label: 'Wind' },
                { icon: '☀️', val: 'UV 4', label: 'Index' },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16 }}>{m.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f0f4f0' }}>{m.val}</div>
                  <div style={{ fontSize: 10, color: '#8a9e8a' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          {weatherData.forecast.map(f => (
            <div key={f.day} className="card" style={{ padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{f.icon}</span>
                <span style={{ fontSize: 12, color: '#8a9e8a' }}>{f.day}</span>
              </div>
              <div style={{ fontSize: 11, color: '#3a8cc8' }}>🌧 {f.rain}</div>
              <div style={{ fontSize: 12, color: '#f0f4f0', fontWeight: 600 }}>{f.high}° / {f.low}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market strip */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 12 }}>
          Live Market Prices <span className="chip chip-green" style={{ marginLeft: 8, verticalAlign: 'middle' }}>Live</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {marketPrices.map(m => (
            <div key={m.crop} className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f4f0', marginBottom: 2 }}>{m.crop}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#f0f4f0' }}>{m.price}</div>
              <div style={{ fontSize: 11, color: '#8a9e8a', marginBottom: 6 }}>{m.unit}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: m.trend === 'up' ? '#7ec87e' : '#c85820' }}>
                  {m.trend === 'up' ? '↑' : '↓'} {m.change}
                </span>
                <span style={{ fontSize: 11, color: '#4a9e4a' }}>{m.buyers} buyers</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
