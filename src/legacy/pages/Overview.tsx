// @ts-nocheck
'use client';

import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  CloudRain,
  CloudSun,
  Droplets,
  Globe,
  Info,
  Leaf,
  Sun,
  Wheat,
  Wind,
} from 'lucide-react';
import { useDashboardData } from '../data/dashboard-provider';
import {
  farmFields as fallbackFarmFields,
  soilMetrics as fallbackSoilMetrics,
  yieldForecast as fallbackYield,
  alerts as fallbackAlerts,
  weatherData as fallbackWeather,
  marketPrices as fallbackMarketPrices,
} from '../data/dummyData';

const statusColor = { healthy: '#7ec87e', warning: '#e8a020', alert: '#c85820' };
const statusLabel = { healthy: 'Healthy', warning: 'Warning', alert: 'Alert' };

function MetricCard({ label, value, unit, sub, icon, color = '#7ec87e', delay = 0, pulse = false }) {
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
        <div style={{ fontSize: 12, color: '#8a9e8a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ fontSize: 20 }}>{icon}</div>
      </div>
      <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '1.9rem', color, lineHeight: 1 }}>
        {value}<span style={{ fontSize: '1rem', fontWeight: 500, color: '#8a9e8a', marginLeft: 4 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 12, color: pulse ? '#e8a020' : '#4a9e4a', marginTop: 6 }}>{sub}</div>
    </div>
  );
}

function buildTodayActions({ alerts, weatherData, fields }) {
  const criticalAlert = alerts.find((a) => a.type === 'alert') || alerts[0];
  const driestField = [...fields].sort((a, b) => (a.moisture ?? 100) - (b.moisture ?? 100))[0];
  const rainSoon = weatherData?.forecast?.find((f) => parseInt(f.rain, 10) >= 60);

  const actions = [];

  if (driestField) {
    actions.push({
      title: `Water ${driestField.name}`,
      detail: `${driestField.moisture}% moisture · target 55-65%`,
      color: '#80c0f0',
      icon: <Droplets size={16} color="#80c0f0" />,
    });
  }

  if (criticalAlert) {
    actions.push({
      title: 'Resolve alert',
      detail: criticalAlert.message,
      color: '#c85820',
      icon: <AlertTriangle size={16} color="#c85820" />,
    });
  }

  if (rainSoon) {
    actions.push({
      title: 'Adjust irrigation',
      detail: `${rainSoon.day}: ${rainSoon.rain} rain expected`,
      color: '#4a9e4a',
      icon: <CloudRain size={16} color="#4a9e4a" />,
    });
  }

  return actions.length ? actions : [{
    title: 'All clear',
    detail: 'No urgent actions right now.',
    color: '#7ec87e',
    icon: <CheckCircle2 size={16} color="#7ec87e" />,
  }];
}

function FieldCard({ field }) {
  const col = statusColor[field.status];
  return (
    <div className="card" style={{ padding: '16px 18px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 14, color: '#f0f4f0' }}>{field.name}</div>
          <div style={{ fontSize: 11, color: '#8a9e8a', marginTop: 2 }}>{field.location} · {field.hectares} ha</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="status-dot" style={{ background: col, boxShadow: `0 0 8px ${col}` }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: col }}>{statusLabel[field.status]}</span>
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#8a9e8a' }}>NDVI Health Index</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: col }}>{(field.ndvi * 100).toFixed(0)}%</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
          <div style={{ width: `${field.ndvi * 100}%`, height: '100%', background: `linear-gradient(90deg, ${col}60, ${col})`, borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#8a9e8a' }}>Soil Moisture</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: field.moisture < 40 ? '#c85820' : '#80c0f0' }}>{field.moisture}%</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
          <div style={{ width: `${field.moisture}%`, height: '100%', background: 'linear-gradient(90deg, #3a8cc860, #80c0f0)', borderRadius: 4, transition: 'width 1s ease' }} />
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
        <div style={{ color: '#7ec87e', fontWeight: 600, marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, display: 'flex', gap: 8, marginBottom: 2 }}>
            <span>{p.name}:</span><span style={{ fontWeight: 600 }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Overview({ onNav }) {
  const { data } = useDashboardData();
  const {
    farmFields = fallbackFarmFields,
    soilMetrics = fallbackSoilMetrics,
    yieldForecast = fallbackYield,
    alerts = fallbackAlerts,
    weatherData = fallbackWeather,
    marketPrices = fallbackMarketPrices,
  } = data || {};

  const fields = Array.isArray(farmFields) ? farmFields : fallbackFarmFields;
  const soil = Array.isArray(soilMetrics) ? soilMetrics : fallbackSoilMetrics;
  const yields = Array.isArray(yieldForecast) ? yieldForecast : fallbackYield;
  const alertsSafe = Array.isArray(alerts) ? alerts : fallbackAlerts;
  const markets = Array.isArray(marketPrices) ? marketPrices : fallbackMarketPrices;

  const totalHectares = fields.reduce((s, f) => s + f.hectares, 0);
  const healthyCount  = fields.filter(f => f.status === 'healthy').length;
  const alertIconMap = {
    alert: AlertTriangle,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle2,
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Wheat size={22} color="#7ec87e" />
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: 600, color: '#f0f4f0', margin: 0 }}>Farm Overview</h1>
        </div>
        <div style={{ fontSize: 14, color: '#8a9e8a' }}>
          Monday, 30 March 2026 · <span style={{ color: '#4a9e4a' }}>All sensors online</span>
          <span className="status-dot status-ok" style={{ marginLeft: 8 }} />
        </div>
      </div>

      {/* Mobile-first Today view */}
      <div className="today-mobile card" style={{ padding: 16, background: 'linear-gradient(180deg, rgba(46,92,46,0.8), rgba(15,30,15,0.95))', border: '1px solid rgba(126,200,126,0.25)', marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Today</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8a9e8a', fontSize: 12 }}>
            <CloudSun size={16} /> {weatherData.current.temp}°C
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(126,200,126,0.25)' }}>
            <div style={{ fontSize: 12, color: '#8a9e8a' }}>Next action</div>
            {buildTodayActions({ alerts: alertsSafe, weatherData, fields })[0] ? (
              <>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#f0f4f0', marginTop: 4 }}>
                  {buildTodayActions({ alerts: alertsSafe, weatherData, fields })[0].title}
                </div>
                <div style={{ fontSize: 12, color: '#a8b4a8', marginTop: 2 }}>
                  {buildTodayActions({ alerts: alertsSafe, weatherData, fields })[0].detail}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: '#a8b4a8' }}>No urgent tasks.</div>
            )}
          </div>
          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(90,140,200,0.25)' }}>
            <div style={{ fontSize: 12, color: '#8a9e8a' }}>Irrigation window</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              {['08:00','12:00','16:00'].map((t) => (
                <div key={t} style={{ flex: 1, height: 10, borderRadius: 999, background: 'rgba(126,200,126,0.25)' }} />
              ))}
            </div>
            <div style={{ fontSize: 12, color: '#a8b4a8', marginTop: 8 }}>Skip if rain &gt;60% tomorrow.</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { label: 'Moisture', value: fields[0]?.moisture ?? 53, color: '#80c0f0' },
            { label: 'UV', value: '5', color: '#e8a020' },
            { label: 'Wind', value: `${weatherData.current.wind} km/h`, color: '#5db8ff' },
            { label: 'Health', value: `${healthyCount}/${fields.length}`, color: '#7ec87e' },
          ].map((m) => (
            <div key={m.label} style={{ padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(168,186,149,0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#8a9e8a' }}>{m.label}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Today actions */}
      <div className="card" style={{ padding: '14px 16px', marginBottom: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
        {buildTodayActions({ alerts: alertsSafe, weatherData, fields }).map((action) => (
          <div key={action.title} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: `${action.color}22`, border: `1px solid ${action.color}55`, display: 'grid', placeItems: 'center' }}>
              {action.icon}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#f0f4f0' }}>{action.title}</div>
              <div style={{ fontSize: 12, color: '#8a9e8a' }}>{action.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Total Area" value={totalHectares.toFixed(1)} unit="ha" sub="4 active fields" icon={<Globe size={18} />} color="#7ec87e" delay={0} />
        <MetricCard label="Healthy Fields" value={healthyCount} unit={`/${fields.length}`} sub="2 need attention" icon={<Leaf size={18} />} color="#7ec87e" delay={50} />
        <MetricCard label="Avg Moisture" value="53" unit="%" sub="Field D critical" icon={<Droplets size={18} />} color="#80c0f0" delay={100} />
        <MetricCard label="Active Alerts" value="2" unit="" sub="1 critical - act now" icon={<AlertTriangle size={18} />} color="#e8a020" delay={150} pulse />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0' }}>Soil Moisture — Today</div>
            <div style={{ fontSize: 12, color: '#8a9e8a' }}>Field A (Maize) · ESP32 sensor network</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={soil}>
              <defs>
                <linearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3a8cc8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3a8cc8" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time"     tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis                    tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[30, 80]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="moisture" name="Moisture %" stroke="#3a8cc8" fill="url(#moistGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0' }}>Yield Forecast</div>
            <div style={{ fontSize: 12, color: '#8a9e8a' }}>Tonnes/hectare · AI prediction model</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={yields}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis                 tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[1.5, 4.5]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="actual"   name="Actual"      stroke="#7ec87e" strokeWidth={2.5} dot={{ fill: '#7ec87e', r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="#e8a020" strokeWidth={2}   strokeDasharray="5 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fields + Alerts + Weather */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 20 }}>
        {/* Fields */}
        <div>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 12 }}>Field Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {fields.map(f => <FieldCard key={f.id} field={f} />)}
          </div>
        </div>

        {/* Alerts — clickable → navigate to alerts page */}
        <div>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 12 }}>Recent Alerts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alertsSafe.map(alert => {
              const borderCol = alert.type === 'alert' ? '#c85820' : alert.type === 'warning' ? '#e8a020' : alert.type === 'success' ? '#7ec87e' : '#3a8cc8';
              const Icon = alertIconMap[alert.type] || Info;
              return (
                <div
                  key={alert.id}
                  className="card"
                  onClick={() => onNav?.('alerts')}
                  style={{ padding: '14px 16px', borderLeft: `3px solid ${borderCol}`, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Icon size={18} color={borderCol} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f4f0', marginBottom: 3 }}>{alert.field}</div>
                      <div style={{ fontSize: 12, color: '#8a9e8a', lineHeight: 1.4 }}>{alert.message}</div>
                      <div style={{ fontSize: 10, color: '#4a6e4a', marginTop: 6 }}>{alert.time}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              onClick={() => onNav?.('alerts')}
              style={{ fontSize: 12, color: '#4a9e4a', cursor: 'pointer', textAlign: 'center', padding: '8px', fontWeight: 600 }}
            >
              View all alerts
            </div>
          </div>
        </div>

        {/* Weather — clickable → navigate to weather page */}
        <div>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 12 }}>Weather</div>
          <div
            className="card"
            onClick={() => onNav?.('weather')}
            style={{ padding: '20px', marginBottom: 10, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CloudSun size={34} />
              </div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '1.9rem', color: '#f0f4f0', lineHeight: 1 }}>
                {weatherData.current.temp}°C
              </div>
              <div style={{ fontSize: 13, color: '#8a9e8a', marginTop: 4 }}>{weatherData.current.condition}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(74,158,74,0.1)' }}>
              {[
                { Icon: Droplets, val: `${weatherData.current.humidity}%`, label: 'Humidity' },
                { Icon: Wind, val: `${weatherData.current.wind}km/h`, label: 'Wind' },
                { Icon: Sun, val: 'UV 4', label: 'Index' },
              ].map((metric) => (
                <div key={metric.label} style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><metric.Icon size={14} /></div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f4f0' }}>{metric.val}</div>
                  <div style={{ fontSize: 10, color: '#8a9e8a' }}>{metric.label}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: '#4a9e4a', fontWeight: 600 }}>
              Tap for full forecast
            </div>
          </div>
          {(weatherData.forecast || []).map(f => (
            <div key={f.day} className="card" style={{ padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CloudSun size={16} />
                <span style={{ fontSize: 12, color: '#8a9e8a' }}>{f.day}</span>
              </div>
              <div style={{ fontSize: 11, color: '#3a8cc8', display: 'flex', alignItems: 'center', gap: 4 }}><CloudRain size={12} /> {f.rain}</div>
              <div style={{ fontSize: 12, color: '#f0f4f0', fontWeight: 600 }}>{f.high}° / {f.low}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market strip */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 12 }}>
          Live Market Prices <span className="chip chip-green" style={{ marginLeft: 8, verticalAlign: 'middle' }}>Live</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {markets.map(m => (
            <div key={m.crop} className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f4f0', marginBottom: 2 }}>{m.crop}</div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '1.3rem', color: '#f0f4f0' }}>{m.price}</div>
              <div style={{ fontSize: 11, color: '#8a9e8a', marginBottom: 6 }}>{m.unit}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: m.trend === 'up' ? '#7ec87e' : '#c85820' }}>
                  {m.trend === 'up' ? <ArrowUp size={12} style={{ verticalAlign: 'middle' }} /> : <ArrowDown size={12} style={{ verticalAlign: 'middle' }} />} {m.change}
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
