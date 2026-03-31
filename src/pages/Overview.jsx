import { useMemo, useState, useEffect } from 'react';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { farmFields, soilMetrics, yieldForecast, alerts, marketPrices } from '../data/dummyData';
import useMediaQuery from '../lib/useMediaQuery';
import { getFieldStyle } from '../lib/fieldColors';
import RealtimeStream from '../components/RealtimeStream.jsx';
import useRealtimeFarmFeed from '../lib/useRealtimeFarmFeed';
import { fetchWeather } from '../services/weatherService';

const statusColor = { healthy: '#22c55e', warning: '#f59e0b', alert: '#ef4444' };
const statusLabel = { healthy: 'Healthy', warning: 'Warning', alert: 'Alert' };

const alertIconByType = {
  alert: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

const numericOrNull = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const getAtPath = (obj, path) => {
  let cursor = obj;
  for (const key of path) {
    if (cursor == null || typeof cursor !== 'object') return null;
    cursor = cursor[key];
  }
  return cursor;
};

const findFirstNestedMoisture = (node) => {
  if (node == null || typeof node !== 'object') return null;

  const entries = Object.entries(node);

  for (const [key, value] of entries) {
    if (!/moist/i.test(key)) continue;
    const asNumber = numericOrNull(value);
    if (asNumber != null) return asNumber;
  }

  for (const [, value] of entries) {
    if (value && typeof value === 'object') {
      const match = findFirstNestedMoisture(value);
      if (match != null) return match;
    }
  }

  return null;
};

const extractSoilMoisture = (payload) => {
  if (!payload || typeof payload !== 'object') return null;

  const preferredPaths = [
    ['soil', 'moisture'],
    ['soil', 'moisturePercent'],
    ['soil_moisture'],
    ['soilMoisture'],
    ['sensors', 'soil', 'moisture'],
    ['sensors', 'soil_moisture'],
    ['latest', 'soil', 'moisture'],
    ['latest', 'soil_moisture'],
    ['latest', 'soilMoisture'],
  ];

  for (const path of preferredPaths) {
    const value = numericOrNull(getAtPath(payload, path));
    if (value != null) return value;
  }

  const soilBranch = payload.soil ?? payload.soilData ?? payload.sensors?.soil;
  const fromSoilBranch = findFirstNestedMoisture(soilBranch);
  if (fromSoilBranch != null) return fromSoilBranch;

  return findFirstNestedMoisture(payload);
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const extractRawSoilReading = (payload) => {
  if (!payload || typeof payload !== 'object') return null;

  const directRaw = numericOrNull(payload.soil);
  const directThreshold = numericOrNull(payload.dryThreshold);
  if (directRaw != null) {
    return {
      raw: directRaw,
      dryThreshold: directThreshold,
      from: 'root',
    };
  }

  const latestRaw = numericOrNull(payload.latest?.soil);
  const latestThreshold = numericOrNull(payload.latest?.dryThreshold);
  if (latestRaw != null) {
    return {
      raw: latestRaw,
      dryThreshold: latestThreshold,
      from: 'latest',
    };
  }

  return null;
};

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
  const fieldTag = getFieldStyle(field.name);
  return (
    <div className="card" style={{ padding: '16px 18px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-strong)' }}>{field.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2 }}>{field.location}  {field.hectares} ha</div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginTop: 6,
              padding: '2px 8px',
              borderRadius: 999,
              background: fieldTag.bg,
              boxShadow: `inset 0 0 0 1px ${fieldTag.border}`,
              fontSize: 10,
              fontWeight: 700,
              color: fieldTag.color,
            }}
          >
            {fieldTag.label}
          </div>
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
        <div style={{ fontSize: 12, fontWeight: 700, color: '#7ec87e' }}>Open →</div>
      </div>
      <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text-soft)' }}>Last scan: {field.lastScan}</div>
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
  const [weatherData, setWeatherData] = useState({
    current: { temp: 24, humidity: 58, wind: 12, condition: 'Loading...', icon: '⏳', uvIndex: 0 }
  });
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setWeatherLoading(true);
        const data = await fetchWeather();
        setWeatherData(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
      } finally {
        setWeatherLoading(false);
      }
    };

    loadWeather();
  }, []);

  const realtimePath = '/farms/thabo-farm/latest';
  const { data: realtimeData, status: realtimeStatus } = useRealtimeFarmFeed(realtimePath);
  const criticalAlerts = alerts.filter((a) => a.type === 'alert').length;
  const warningAlerts = alerts.filter((a) => a.type === 'warning').length;
  const resolvedAlerts = alerts.filter((a) => a.type === 'success').length;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');
  const latestSnapshot = (realtimeData && typeof realtimeData === 'object' && realtimeData.latest)
    ? realtimeData.latest
    : realtimeData;
  const latestDeviceId = latestSnapshot?.deviceId || 'device offline';
  const soilReading = numericOrNull(latestSnapshot?.soil);
  const humidityReading = numericOrNull(latestSnapshot?.humidity);
  const temperatureReading = numericOrNull(latestSnapshot?.temperature);
  const dryThresholdReading = numericOrNull(latestSnapshot?.dryThreshold);
  const pumpState = typeof latestSnapshot?.pump === 'string' ? latestSnapshot.pump : '--';
  const liveSoilMoisture = useMemo(() => {
    const moistureValue = extractSoilMoisture(realtimeData);
    if (moistureValue != null) {
      return {
        value: clamp(moistureValue, 0, 100),
        source: 'moisture-field',
      };
    }

    const rawReading = extractRawSoilReading(realtimeData);
    if (!rawReading) return null;

    return {
      value: rawReading.raw,
      source: 'soil-raw',
      raw: rawReading.raw,
      dryThreshold: rawReading.dryThreshold,
    };
  }, [realtimeData]);
  const moistureSubtext = liveSoilMoisture?.source === 'soil-raw'
    ? `Live IoT feed (${realtimeStatus})`
    : liveSoilMoisture?.source === 'moisture-field'
      ? `Live IoT feed (${realtimeStatus})`
      : 'No moisture reading in feed (using baseline)';

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
        <MetricCard
          label="Soil Sensor"
          value={soilReading != null ? soilReading.toFixed(0) : '--'}
          unit=""
          sub={dryThresholdReading != null ? `Dry threshold ${dryThresholdReading.toFixed(0)}` : `Live ${realtimeStatus}`}
          icon="S"
          color="#f59e0b"
          delay={0}
        />
        <MetricCard
          label="Humidity"
          value={humidityReading != null ? humidityReading.toFixed(1) : '--'}
          unit="%"
          sub={`Source ${latestDeviceId}`}
          icon="H"
          color="#475569"
          delay={50}
        />
        <MetricCard
          label="Temperature"
          value={temperatureReading != null ? temperatureReading.toFixed(1) : '--'}
          unit="C"
          sub={`Source ${latestDeviceId}`}
          icon="T"
          color="#22c55e"
          delay={100}
        />
        <MetricCard
          label="Pump State"
          value={pumpState}
          unit=""
          sub={moistureSubtext}
          icon="P"
          color={pumpState === 'ON' ? '#22c55e' : '#ef4444'}
          delay={150}
          pulse={pumpState === 'ON'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
        <div className="card" style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.12)', boxShadow: 'inset 0 0 0 1px rgba(239,68,68,0.36)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', fontWeight: 800 }}>Critical</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>{criticalAlerts} require immediate action</div>
        </div>
        <div className="card" style={{ padding: '12px 14px', background: 'rgba(245,158,11,0.12)', boxShadow: 'inset 0 0 0 1px rgba(245,158,11,0.34)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', fontWeight: 800 }}>Watch</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{warningAlerts} need monitoring</div>
        </div>
        <div className="card" style={{ padding: '12px 14px', background: 'rgba(34,197,94,0.12)', boxShadow: 'inset 0 0 0 1px rgba(34,197,94,0.34)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', fontWeight: 800 }}>Stable</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>{resolvedAlerts} resolved</div>
        </div>
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
          <div style={{ marginTop: 12 }}>
            <RealtimeStream path={realtimePath} data={realtimeData} status={realtimeStatus} />
          </div>
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
          </div>
        </div>

        <div>
          <div className="section-kicker" style={{ marginBottom: 6 }}>Attention Queue</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 12 }}>Recent Alerts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map(alert => {
              const borderCol = alert.type === 'alert' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : alert.type === 'success' ? '#22c55e' : '#fbbf24';
              const fieldTag = getFieldStyle(alert.field);
              const Icon = alertIconByType[alert.type] || Info;
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
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 999,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: borderCol,
                        background: `${borderCol}14`,
                        boxShadow: `inset 0 0 0 1px ${borderCol}33`,
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={14} strokeWidth={1.65} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-strong)' }}>{alert.field}</span>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 999,
                            background: fieldTag.color,
                            boxShadow: `0 0 0 3px ${fieldTag.bg}`,
                            flexShrink: 0,
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.4 }}>{alert.message}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-soft)', marginTop: 6 }}>{alert.time}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              onClick={() => onNav?.('alerts')}
              style={{ fontSize: 12, color: 'var(--text-soft)', cursor: 'pointer', textAlign: 'center', padding: '8px', fontWeight: 700 }}
            >
              View all alerts 
            </div>
          </div>
        </div>

        {/* ── Weather widget — live data ── */}
        <div>
          <div className="section-kicker" style={{ marginBottom: 6 }}>Climate Snapshot</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 12 }}>Weather</div>
          <div
            className="card"
            onClick={() => onNav?.('weather')}
            style={{ padding: '20px', marginBottom: 10, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {weatherLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>⏳</div>
                <div style={{ fontSize: 13, color: 'var(--text-soft)' }}>Loading weather...</div>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 40 }}>{weatherData.current.icon}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.2rem', color: 'var(--text-strong)', lineHeight: 1 }}>
                    {weatherData.current.temp}°C
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 4 }}>{weatherData.current.condition}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12, paddingTop: 12 }}>
                  {[
                    { icon: 'H', val: `${weatherData.current.humidity}%`, label: 'Humidity' },
                    { icon: 'W', val: `${weatherData.current.wind}km/h`, label: 'Wind' },
                    { icon: 'U', val: `UV ${Math.round(weatherData.current.uvIndex ?? 0)}`, label: 'Index' },
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
              </>
            )}
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


