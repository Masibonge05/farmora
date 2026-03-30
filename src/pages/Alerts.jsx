import { alerts } from '../data/dummyData';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

const allAlerts = [
  ...alerts,
  { id: 5, type: 'alert', field: 'Field D', message: 'Sensor SN-04 battery at 15% — data collection at risk', time: '12 min ago', icon: '🔋' },
  { id: 6, type: 'warning', field: 'Field B', message: 'Soil pH dropped to 6.1 — approaching acidic threshold for tomatoes', time: '2h ago', icon: '🧪' },
  { id: 7, type: 'info', field: 'All Fields', message: 'Rain forecast Wednesday–Thursday (70–85%). Adjust irrigation schedules.', time: '4h ago', icon: '🌧' },
  { id: 8, type: 'success', field: 'System', message: 'Weekly AI model update completed — disease detection accuracy improved to 94%', time: '1d ago', icon: '🤖' },
];

const typeConfig = {
  alert: { color: '#c85820', bg: 'rgba(200,88,32,0.08)', border: 'rgba(200,88,32,0.3)', label: 'Critical', icon: XCircle },
  warning: { color: '#e8a020', bg: 'rgba(232,160,32,0.08)', border: 'rgba(232,160,32,0.3)', label: 'Warning', icon: AlertTriangle },
  info: { color: '#80c0f0', bg: 'rgba(58,140,200,0.08)', border: 'rgba(58,140,200,0.3)', label: 'Info', icon: Info },
  success: { color: '#7ec87e', bg: 'rgba(74,158,74,0.08)', border: 'rgba(74,158,74,0.3)', label: 'Resolved', icon: CheckCircle },
};

export default function Alerts() {
  const critical = allAlerts.filter(a => a.type === 'alert').length;
  const warnings = allAlerts.filter(a => a.type === 'warning').length;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#f0f4f0', margin: 0, marginBottom: 6 }}>
          ⚠️ Alerts & Notifications
        </h1>
        <div style={{ fontSize: 14, color: '#8a9e8a' }}>
          {critical} critical · {warnings} warnings · Updated in real-time
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {Object.entries(typeConfig).map(([type, cfg]) => {
          const count = allAlerts.filter(a => a.type === type).length;
          return (
            <div key={type} className="card" style={{ padding: '16px 18px', borderLeft: `3px solid ${cfg.color}` }}>
              <div style={{ fontSize: 12, color: '#8a9e8a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cfg.label}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: cfg.color, lineHeight: 1 }}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Alert list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {allAlerts.map(alert => {
          const cfg = typeConfig[alert.type];
          const Icon = cfg.icon;
          return (
            <div key={alert.id} style={{ 
              padding: '16px 20px', borderRadius: 14,
              background: cfg.bg, border: `1px solid ${cfg.border}`,
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{alert.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <span className={`chip ${alert.type === 'alert' ? 'chip-red' : alert.type === 'warning' ? 'chip-amber' : alert.type === 'success' ? 'chip-green' : 'chip-blue'}`} style={{ marginRight: 8 }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#f0f4f0' }}>{alert.field}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#4a6e4a', whiteSpace: 'nowrap', marginLeft: 10 }}>{alert.time}</span>
                </div>
                <div style={{ fontSize: 13, color: '#c0d0c0', lineHeight: 1.5 }}>{alert.message}</div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <button style={{ 
                  background: `${cfg.color}20`, border: `1px solid ${cfg.color}40`,
                  color: cfg.color, borderRadius: 7, padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  {alert.type === 'success' ? 'View' : 'Action'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
