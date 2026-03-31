import { sensorNodes } from '../data/dummyData';
import { Wifi, Battery, Signal, Clock, AlertTriangle } from 'lucide-react';
import useMediaQuery from '../lib/useMediaQuery';
import { getFieldStyle } from '../lib/fieldColors';

const allSensors = [
  ...sensorNodes,
  { id: 'SN-06', field: 'Field C', battery: 78, signal: 'Strong', lastPing: '3m ago', status: 'online' },
  { id: 'SN-07', field: 'Field D', battery: 8, signal: 'None', lastPing: '45m ago', status: 'offline' },
];

const BatteryIcon = ({ level }) => {
  const color = level < 20 ? '#111827' : level < 50 ? '#64748b' : '#475569';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 24, height: 12, border: `2px solid ${color}`, borderRadius: 3, position: 'relative', display: 'flex', alignItems: 'center', padding: 1 }}>
        <div style={{ width: `${level}%`, height: '100%', background: color, borderRadius: 1, maxWidth: '100%' }} />
        <div style={{ position: 'absolute', right: -5, top: 2, width: 3, height: 6, background: color, borderRadius: '0 2px 2px 0' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{level}%</span>
    </div>
  );
};

const signalColor = { Strong: '#475569', Good: '#64748b', Weak: '#64748b', Poor: '#111827', None: '#666' };

export default function Sensors() {
  const online = allSensors.filter(s => s.status === 'online').length;
  const warning = allSensors.filter(s => s.status === 'warning').length;
  const offline = allSensors.filter(s => s.status === 'offline').length;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');

  return (
    <div style={{ padding: isMobile ? '18px 14px' : '28px 32px', width: '100%' }}>
      <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-strong)', margin: 0, marginBottom: 6 }}>
           IoT Sensor Network
        </h1>
          <div style={{ fontSize: 14, color: 'var(--text-soft)' }}>ESP32-based sensor nodes - Real-time environmental monitoring</div>
      </div>

      {/* Status summary */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Nodes', val: allSensors.length, color: '#1f2937', icon: 'ALL' },
          { label: 'Online', val: online, color: '#475569', icon: 'ON' },
          { label: 'Warning', val: warning, color: '#64748b', icon: 'WRN' },
          { label: 'Offline', val: offline, color: '#111827', icon: 'OFF' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sensor list */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 16 }}>
          All Sensor Nodes
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
          {allSensors.map(sensor => {
            const statusCol = sensor.status === 'online' ? '#475569' : sensor.status === 'warning' ? '#64748b' : '#111827';
            const fieldTag = getFieldStyle(sensor.field);
            return (
              <div key={sensor.id} style={{ 
                padding: '14px 16px', borderRadius: 12,
                background: 'rgba(148,163,184,0.08)',
                boxShadow: `inset 0 0 0 1px ${statusCol}20`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-strong)' }}>{sensor.id}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-soft)' }}>{sensor.field}</div>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: fieldTag.color, boxShadow: `0 0 0 3px ${fieldTag.bg}` }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span className="status-dot" style={{ background: statusCol, boxShadow: `0 0 6px ${statusCol}` }}></span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: statusCol, textTransform: 'capitalize' }}>{sensor.status}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-soft)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Battery size={12} /> Battery
                    </span>
                    <BatteryIcon level={sensor.battery} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-soft)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Wifi size={12} /> Signal
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: signalColor[sensor.signal] || '#6b7280' }}>{sensor.signal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-soft)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> Last ping
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-strong)' }}>{sensor.lastPing}</span>
                  </div>
                </div>

                {sensor.battery < 20 && (
                  <div style={{ marginTop: 10, padding: '6px 8px', background: 'rgba(31,41,55,0.15)', borderRadius: 6, fontSize: 11, color: 'var(--text-soft)', display: 'flex', gap: 5, alignItems: 'center' }}>
                    <AlertTriangle size={11} /> Battery critical - replace soon
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Data transmission stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 16 }}>
            Network Health
          </div>
          {[
            { label: 'Data points collected today', val: '14,832', good: true },
            { label: 'Average transmission latency', val: '340ms', good: true },
            { label: 'Packet loss rate', val: '0.4%', good: true },
            { label: 'Uptime (30 days)', val: '99.1%', good: true },
            { label: 'Nodes needing maintenance', val: '2', good: false },
          ].map(stat => (
            <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', boxShadow: 'inset 0 -1px rgba(100,116,139,0.1)', fontSize: 13 }}>
              <span style={{ color: 'var(--text-soft)' }}>{stat.label}</span>
              <span style={{ fontWeight: 700, color: stat.good ? '#475569' : '#64748b' }}>{stat.val}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 16 }}>
            Add New Sensor Node
          </div>
          {[
            { label: 'Node ID', placeholder: 'e.g. SN-08' },
            { label: 'Assign to Field', placeholder: 'Select field...' },
            { label: 'GPS Coordinates', placeholder: '-24.6543, 29.8821' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: 'var(--text-soft)', display: 'block', marginBottom: 5 }}>{f.label}</label>
              <input 
                placeholder={f.placeholder}
                style={{ 
                  width: '100%', padding: '9px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)', border: 'none', boxShadow: 'inset 0 -1px rgba(100,116,139,0.3)',
                  color: 'var(--text-strong)', fontSize: 13, outline: 'none', fontFamily: 'Manrope, sans-serif'
                }}
              />
            </div>
          ))}
          <button style={{ 
            width: '100%', padding: '10px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg, #475569, #64748b)',
            color: 'var(--text-strong)', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Manrope, sans-serif'
          }}>
            + Pair Sensor
          </button>
        </div>
      </div>
    </div>
  );
}



