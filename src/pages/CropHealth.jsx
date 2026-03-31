import { useEffect, useMemo, useState } from 'react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  Leaf,
  Thermometer,
  Droplets,
  FlaskConical,
  Zap,
  Activity,
  ArrowRight,
  Sprout,
} from 'lucide-react'
import useMediaQuery from '../lib/useMediaQuery'
import { subscribeToFarmData } from "../farmoraRealtime";

const fieldDefinitions = [
  { id: 'field-a', name: 'Field A', crop: 'Maize', ph: 6.4, ec: 1.4, accent: '#22c55e' },
  { id: 'field-b', name: 'Field B', crop: 'Beans', ph: 5.8, ec: 1.1, accent: '#3b82f6' },
  { id: 'field-c', name: 'Field C', crop: 'Cabbage', ph: 6.7, ec: 1.9, accent: '#a855f7' },
  { id: 'field-d', name: 'Field D', crop: 'Spinach', ph: 5.4, ec: 0.9, accent: '#f59e0b' },
]

function getFieldStatus(soil, ph) {
  if (soil < 850 || ph < 5.6) return 'alert'
  if (soil < 1000 || ph < 5.9) return 'warning'
  return 'healthy'
}

function getStatusLabel(status) {
  if (status === 'healthy') return 'Healthy'
  if (status === 'warning') return 'Warning'
  return 'Alert'
}

function getStatusChip(status) {
  if (status === 'healthy') return 'chip-green'
  if (status === 'warning') return 'chip-amber'
  return 'chip-red'
}

function getRadarFields(liveData) {
  const soilBase = Number(liveData?.soil || 0)
  const tempBase = Number(liveData?.temperature || 0)
  const humidityBase = Number(liveData?.humidity || 0)

  return [
    {
      metric: 'Moisture',
      A: Math.min(100, Math.max(20, soilBase / 12)),
      B: Math.min(100, Math.max(18, soilBase / 14)),
      C: Math.min(100, Math.max(22, soilBase / 11)),
      D: Math.min(100, Math.max(16, soilBase / 15)),
    },
    {
      metric: 'Temp Health',
      A: Math.min(100, Math.max(30, 100 - Math.abs(tempBase - 26) * 6)),
      B: Math.min(100, Math.max(28, 100 - Math.abs(tempBase - 24) * 7)),
      C: Math.min(100, Math.max(35, 100 - Math.abs(tempBase - 23) * 5)),
      D: Math.min(100, Math.max(25, 100 - Math.abs(tempBase - 22) * 7)),
    },
    {
      metric: 'Humidity',
      A: Math.min(100, Math.max(30, humidityBase)),
      B: Math.min(100, Math.max(28, humidityBase - 5)),
      C: Math.min(100, Math.max(35, humidityBase + 3)),
      D: Math.min(100, Math.max(25, humidityBase - 8)),
    },
    {
      metric: 'Nutrient pH',
      A: 88,
      B: 72,
      C: 92,
      D: 61,
    },
    {
      metric: 'EC Balance',
      A: 82,
      B: 68,
      C: 86,
      D: 58,
    },
    {
      metric: 'Irrigation',
      A: liveData?.pump === 'ON' ? 85 : 70,
      B: liveData?.pump === 'ON' ? 78 : 68,
      C: liveData?.pump === 'ON' ? 83 : 72,
      D: liveData?.pump === 'ON' ? 74 : 60,
    },
  ]
}

export default function CropHealth({ onOpenField }) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1100px)')
  const [liveData, setLiveData] = useState(null)

  useEffect(() => {
    const unsubscribe = subscribeToFarmData(setLiveData)
    return () => unsubscribe()
  }, [])

  const fields = useMemo(() => {
    return fieldDefinitions.map((field) => ({
      ...field,
      soil: liveData?.soil ?? 0,
      temperature: liveData?.temperature ?? 0,
      humidity: liveData?.humidity ?? 0,
      pump: liveData?.pump ?? 'OFF',
      status: getFieldStatus(liveData?.soil ?? 0, field.ph),
    }))
  }, [liveData])

  const radarData = useMemo(() => getRadarFields(liveData), [liveData])

  const recommendations = useMemo(() => {
    const soil = liveData?.soil ?? 0
    const temp = liveData?.temperature ?? 0
    const humidity = liveData?.humidity ?? 0

    const items = []

    if (soil < 1000) {
      items.push({
        icon: 'IR',
        title: 'Increase Irrigation',
        field: 'All fields linked to live soil sensor',
        desc: 'Soil moisture is low. Increase irrigation duration, inspect emitters, and monitor recharge after watering.',
        type: 'alert',
      })
    }

    if (temp > 32) {
      items.push({
        icon: 'HT',
        title: 'Heat Stress Management',
        field: 'Temperature-based recommendation',
        desc: 'High temperature can reduce crop vigor. Water earlier, reduce heat load, and monitor wilting.',
        type: 'alert',
      })
    }

    if (humidity > 85) {
      items.push({
        icon: 'FG',
        title: 'Fungal Risk Watch',
        field: 'Humidity-driven warning',
        desc: 'High humidity may increase fungal pressure. Improve ventilation and monitor leaves closely.',
        type: 'info',
      })
    }

    if (items.length === 0) {
      items.push({
        icon: 'OK',
        title: 'Conditions Stable',
        field: 'Realtime sensor assessment',
        desc: 'Current moisture, temperature, and humidity are within a manageable range. Continue regular monitoring.',
        type: 'info',
      })
    }

    return items.slice(0, 3)
  }, [liveData])

  return (
    <div style={{ padding: isMobile ? '18px 14px' : '28px 32px', width: '100%' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-strong)', margin: 0, marginBottom: 6 }}>
          Crop Health Monitor
        </h1>
        <div style={{ fontSize: 14, color: 'var(--text-soft)' }}>
          Realtime field health, sensor monitoring, and built-in smart farming tips
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {fields.map((field) => (
          <div
            key={field.id}
            className="card"
            onClick={() => onOpenField?.(field.id)}
            style={{
              padding: '20px',
              cursor: 'pointer',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--text-strong)' }}>
                  {field.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>
                  {field.crop}
                </div>
              </div>
              <Leaf size={18} color={field.accent} />
            </div>

            <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-soft)' }}>Soil</span>
                <span style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{field.soil}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-soft)' }}>Temp</span>
                <span style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{field.temperature} °C</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-soft)' }}>Humidity</span>
                <span style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{field.humidity} %</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-soft)' }}>pH</span>
                <span style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{field.ph}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-soft)' }}>EC</span>
                <span style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{field.ec} mS/cm</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`chip ${getStatusChip(field.status)}`}>
                {getStatusLabel(field.status)}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: field.accent, fontWeight: 700, fontSize: 12 }}>
                Open Field
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 4 }}>
            Multi-Field Realtime Radar
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 16 }}>
            Health scoring using live Firebase data + current pH / EC assumptions
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <Radar name="Field A" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Field B" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Field C" dataKey="C" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Field D" dataKey="D" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
              <Tooltip contentStyle={{ background: '#ffffff', borderRadius: 8, fontSize: 12, boxShadow: '0 10px 24px rgba(15,23,42,0.12)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 4 }}>
            Live Sensor Snapshot
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 16 }}>
            Current data being shared across the crop fields
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <div style={snapshotRow}>
              <span style={snapshotLabel}><Sprout size={14} /> Soil Moisture</span>
              <strong style={snapshotValue}>{liveData?.soil ?? '--'}</strong>
            </div>
            <div style={snapshotRow}>
              <span style={snapshotLabel}><Thermometer size={14} /> Temperature</span>
              <strong style={snapshotValue}>{liveData?.temperature ?? '--'} °C</strong>
            </div>
            <div style={snapshotRow}>
              <span style={snapshotLabel}><Droplets size={14} /> Humidity</span>
              <strong style={snapshotValue}>{liveData?.humidity ?? '--'} %</strong>
            </div>
            <div style={snapshotRow}>
              <span style={snapshotLabel}><Activity size={14} /> Pump</span>
              <strong style={snapshotValue}>{liveData?.pump ?? '--'}</strong>
            </div>
            <div style={snapshotRow}>
              <span style={snapshotLabel}><FlaskConical size={14} /> pH Sensor</span>
              <strong style={snapshotValue}>Simulated per field</strong>
            </div>
            <div style={snapshotRow}>
              <span style={snapshotLabel}><Zap size={14} /> EC Sensor</span>
              <strong style={snapshotValue}>Simulated per field</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 16 }}>
          Smart Recommendations
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: 14,
          }}
        >
          {recommendations.map((r) => (
            <div
              key={r.title}
              style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: r.type === 'alert' ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
                border: `1px solid ${r.type === 'alert' ? 'rgba(239,68,68,0.18)' : 'rgba(34,197,94,0.18)'}`,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{r.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-strong)', marginBottom: 2 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', fontWeight: 600, marginBottom: 6 }}>{r.field}</div>
              <div style={{ fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.5 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const snapshotRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 14px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.04)',
}

const snapshotLabel = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  color: 'var(--text-soft)',
  fontSize: 12,
}

const snapshotValue = {
  color: 'var(--text-strong)',
  fontWeight: 800,
}