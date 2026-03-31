import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Sprout,
  FlaskConical,
  Zap,
  Activity,
  Lightbulb,
  CircleAlert,
  CheckCircle2,
  Waves,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { subscribeToFarmData, subscribeToHistory } from "../farmoraRealtime";
import useMediaQuery from '../lib/useMediaQuery'

const fieldProfiles = {
  'field-a': {
    id: 'field-a',
    fieldName: 'Field A',
    crop: 'Maize',
    ph: 6.4,
    ec: 1.4,
    color: '#22c55e',
  },
  'field-b': {
    id: 'field-b',
    fieldName: 'Field B',
    crop: 'Beans',
    ph: 5.8,
    ec: 1.1,
    color: '#3b82f6',
  },
  'field-c': {
    id: 'field-c',
    fieldName: 'Field C',
    crop: 'Cabbage',
    ph: 6.7,
    ec: 1.9,
    color: '#a855f7',
  },
  'field-d': {
    id: 'field-d',
    fieldName: 'Field D',
    crop: 'Spinach',
    ph: 5.4,
    ec: 0.9,
    color: '#f59e0b',
  },
}

function getTips({ soil, temperature, humidity, pump, ph, ec, crop }) {
  const tips = []

  if (soil < 1000) {
    tips.push({
      type: 'alert',
      title: 'Low Soil Moisture',
      text: `The soil is reading dry for ${crop}. Increase irrigation, inspect drippers, and water deeply rather than too frequently.`,
    })
  } else {
    tips.push({
      type: 'good',
      title: 'Moisture Level Stable',
      text: `Soil moisture is currently in a workable range for ${crop}. Keep monitoring for sudden drops during hot hours.`,
    })
  }

  if (ph < 5.8) {
    tips.push({
      type: 'alert',
      title: 'Soil pH Too Low',
      text: `Your soil pH is acidic. Apply agricultural lime gradually and retest after a few weeks to improve nutrient uptake.`,
    })
  } else if (ph > 7.2) {
    tips.push({
      type: 'warn',
      title: 'Soil pH Slightly High',
      text: `The pH is on the high side. Use acid-forming fertilizers carefully and monitor micronutrient availability.`,
    })
  } else {
    tips.push({
      type: 'good',
      title: 'Soil pH Acceptable',
      text: `The soil pH is in a healthy range for better nutrient availability and crop growth.`,
    })
  }

  if (ec < 1.0) {
    tips.push({
      type: 'warn',
      title: 'Low Soil EC',
      text: `Electrical conductivity is low, which may suggest low nutrient concentration. Consider a balanced fertilizer program.`,
    })
  } else if (ec > 2.5) {
    tips.push({
      type: 'alert',
      title: 'High Soil EC',
      text: `Electrical conductivity is high, which can stress roots. Flush salts if needed and avoid over-fertilizing.`,
    })
  }

  if (temperature > 32) {
    tips.push({
      type: 'warn',
      title: 'High Temperature Stress',
      text: `Temperature is high. Water early in the morning, reduce heat stress, and monitor leaf curling or wilting.`,
    })
  }

  if (humidity > 85) {
    tips.push({
      type: 'warn',
      title: 'High Humidity Disease Risk',
      text: `Humidity is elevated. Improve airflow and monitor closely for fungal disease or leaf spot.`,
    })
  }

  if (pump === 'ON') {
    tips.push({
      type: 'good',
      title: 'Pump Active',
      text: `The irrigation pump is currently ON, which means your automated watering response is working.`,
    })
  }

  return tips
}

function MetricBox({ icon: Icon, label, value, suffix, color = '#22c55e' }) {
  return (
    <div
      className="card"
      style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </div>
        {Icon && <Icon size={18} color={color} />}
      </div>
      <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-strong)' }}>
        {value}
        <span style={{ fontSize: '0.95rem', color: 'var(--text-soft)', marginLeft: 4 }}>{suffix}</span>
      </div>
    </div>
  )
}

export default function CropFieldDetail({ fieldId = 'field-a', onBack }) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1100px)')
  const [liveData, setLiveData] = useState(null)
  const [history, setHistory] = useState([])

  const field = fieldProfiles[fieldId] || fieldProfiles['field-a']

  useEffect(() => {
    const unsubLive = subscribeToFarmData(setLiveData)
    const unsubHistory = subscribeToHistory(setHistory)

    return () => {
      unsubLive()
      unsubHistory()
    }
  }, [])

  const chartData = useMemo(() => {
    return history.slice(-12).map((item, index) => ({
      name: `${index + 1}`,
      soil: item.soil ?? 0,
      temp: item.temperature ?? 0,
      humidity: item.humidity ?? 0,
    }))
  }, [history])

  const smartTips = useMemo(() => {
    return getTips({
      soil: liveData?.soil ?? 0,
      temperature: liveData?.temperature ?? 0,
      humidity: liveData?.humidity ?? 0,
      pump: liveData?.pump ?? 'OFF',
      ph: field.ph,
      ec: field.ec,
      crop: field.crop,
    })
  }, [liveData, field])

  return (
    <div style={{ padding: isMobile ? '18px 14px' : '28px 32px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-soft)',
              padding: '8px 12px',
              borderRadius: 10,
              cursor: 'pointer',
              marginBottom: 12,
            }}
          >
            <ArrowLeft size={16} />
            Back to fields
          </button>

          <h1
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.7rem',
              fontWeight: 800,
              color: 'var(--text-strong)',
              margin: 0,
              marginBottom: 6,
            }}
          >
            {field.fieldName} — {field.crop}
          </h1>
          <div style={{ fontSize: 14, color: 'var(--text-soft)' }}>
            Live sensor data from Firebase + smart agronomy guidance
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '14px 18px',
            minWidth: 220,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 4 }}>Live Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: field.color, fontWeight: 700 }}>
            <Waves size={16} />
            Realtime Firebase Feed Active
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <MetricBox icon={Sprout} label="Soil Moisture Raw" value={liveData?.soil ?? '--'} suffix="" color="#22c55e" />
        <MetricBox icon={Thermometer} label="Temperature" value={liveData?.temperature ?? '--'} suffix="°C" color="#ef4444" />
        <MetricBox icon={Droplets} label="Humidity" value={liveData?.humidity ?? '--'} suffix="%" color="#3b82f6" />
        <MetricBox icon={Activity} label="Pump State" value={liveData?.pump ?? '--'} suffix="" color={liveData?.pump === 'ON' ? '#22c55e' : '#94a3b8'} />
        <MetricBox icon={FlaskConical} label="Soil pH" value={field.ph} suffix="pH" color="#a855f7" />
        <MetricBox icon={Zap} label="Soil EC" value={field.ec} suffix="mS/cm" color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1.2fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 4 }}>
            Live Sensor Trend
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 16 }}>
            Recent history from Firebase
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  borderRadius: 8,
                  fontSize: 12,
                  boxShadow: '0 10px 24px rgba(15,23,42,0.12)',
                }}
              />
              <Line type="monotone" dataKey="soil" stroke="#22c55e" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 4 }}>
            Smart Tips
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 16 }}>
            Built-in recommendations based on current sensor conditions
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {smartTips.map((tip, index) => {
              const tone =
                tip.type === 'alert'
                  ? { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.18)', icon: <CircleAlert size={18} color="#ef4444" /> }
                  : tip.type === 'warn'
                  ? { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)', icon: <Lightbulb size={18} color="#f59e0b" /> }
                  : { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.18)', icon: <CheckCircle2 size={18} color="#22c55e" /> }

              return (
                <div
                  key={index}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 12,
                    background: tone.bg,
                    border: `1px solid ${tone.border}`,
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    {tone.icon}
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-strong)', marginBottom: 4 }}>{tip.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.5 }}>{tip.text}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}