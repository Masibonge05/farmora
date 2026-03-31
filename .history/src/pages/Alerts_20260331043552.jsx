import { useState, useEffect } from 'react';
import { alerts } from '../data/dummyData';
import { AlertTriangle, Info, CheckCircle, XCircle, X, Droplets } from 'lucide-react';
import useMediaQuery from '../lib/useMediaQuery';
import { getFieldStyle } from '../lib/fieldColors';

const baseAlerts = [
  ...alerts,
  { id: 5, type: 'alert',   field: 'Field D',    message: 'Sensor SN-04 battery at 15% - data collection at risk',                     time: '12 min ago', icon: 'AL' },
  { id: 6, type: 'warning', field: 'Field B',    message: 'Soil pH dropped to 6.1 - approaching acidic threshold for tomatoes',         time: '2h ago',     icon: 'WR' },
  { id: 7, type: 'info',    field: 'All Fields', message: 'Rain forecast Wednesday-Thursday (70-85%). Adjust irrigation schedules.',     time: '4h ago',     icon: 'IN' },
  { id: 8, type: 'success', field: 'System',     message: 'Weekly AI model update completed - disease detection accuracy improved to 94%', time: '1d ago',   icon: 'OK' },
];

const typeConfig = {
  alert:   { color: '#ef4444', bg: 'rgba(239,68,68,0.14)',   border: 'rgba(239,68,68,0.45)',   label: 'Critical', icon: XCircle,  hint: 'Act now' },
  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.14)',  border: 'rgba(245,158,11,0.42)',  label: 'Warning',  icon: AlertTriangle, hint: 'Monitor' },
  info:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.38)',  label: 'Info',     icon: Info,     hint: 'Review' },
  success: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.4)',    label: 'Resolved', icon: CheckCircle, hint: 'Stable' },
};

const priorityRank = { alert: 0, warning: 1, info: 2, success: 3 };

function IrrigationModal({ alert, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,30,15,0.99), rgba(8,18,8,0.99))',
        borderRadius: 20,
        padding: '32px 36px', maxWidth: 440, width: '90%',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), inset 0 1px rgba(100,116,139,0.35), inset 0 -1px rgba(100,116,139,0.18)',
        animation: 'slide-in 0.25s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: 'rgba(111,155,134,0.18)', boxShadow: 'inset 0 0 0 1px rgba(111,155,134,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Droplets size={22} color="#8fbda8" />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 17, color: 'var(--text-strong)' }}>Start Irrigation</div>
              <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{alert.field}</div>
            </div>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{
          padding: '14px 16px', borderRadius: 12, marginBottom: 24,
          background: 'rgba(31,41,55,0.1)', boxShadow: 'inset 0 1px rgba(31,41,55,0.25), inset 0 -1px rgba(31,41,55,0.12)',
        }}>
          <div style={{ fontSize: 13, color: '#f0d0c0', lineHeight: 1.6 }}>{alert.message}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 24 }}>
          {[
            { label: 'Target Field',    val: alert.field },
            { label: 'Flow Rate',       val: '6 L/hr per emitter' },
            { label: 'Duration',        val: '4 hours' },
            { label: 'Est. water use',  val: '~144 L total' },
            { label: 'Target moisture', val: '55-65%' },
          ].map(r => (
            <div key={r.label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '9px 0', boxShadow: 'inset 0 -1px rgba(100,116,139,0.12)', fontSize: 12,
            }}>
              <span style={{ color: 'var(--text-soft)' }}>{r.label}</span>
              <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.val}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px', borderRadius: 10, cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)', border: 'none', boxShadow: 'inset 0 1px rgba(255,255,255,0.2)',
            color: 'var(--text-soft)', fontSize: 13, fontWeight: 600, fontFamily: 'Manrope, sans-serif',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 2, padding: '11px', borderRadius: 10, cursor: 'pointer', border: 'none',
            background: 'linear-gradient(135deg, #1a5a8a, #6f9b86)',
            color: 'var(--text-strong)', fontSize: 13, fontWeight: 700, fontFamily: 'Manrope, sans-serif',
            boxShadow: '0 4px 20px rgba(111,155,134,0.35)',
          }}>
             Confirm - Start Irrigation
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type = 'success', onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  const isProcessing = message.startsWith('Connecting');
  const color = isProcessing ? '#64748b' : '#475569';

  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 2000,
      background: 'linear-gradient(135deg, rgba(12,28,12,0.99), rgba(8,18,8,0.99))',
      borderRadius: 16,
      padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: `0 8px 40px ${color}25, inset 0 1px ${color}66`,
      animation: 'slide-in 0.3s ease',
      minWidth: 300, maxWidth: 380,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isProcessing ? <span style={{ fontSize: 12, fontWeight: 800, color }}>...</span> : <CheckCircle size={20} color={color} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-strong)' }}>
          {isProcessing ? 'Processing' : 'Irrigation Started'}
        </div>
        <div style={{ fontSize: 12, color, marginTop: 3, lineHeight: 1.4 }}>{message}</div>
      </div>
      {/* shrinking progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, height: 3,
        borderRadius: '0 0 16px 16px', background: color,
        animation: 'toast-shrink 4s linear forwards', width: '100%',
      }} />
      <style>{`@keyframes toast-shrink { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
}

export default function Alerts() {
  const [alertList, setAlertList]   = useState(baseAlerts);
  const [modalAlert, setModalAlert] = useState(null);
  const [toast, setToast]           = useState(null);
  const [processing, setProcessing] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');

  const critical = alertList.filter(a => a.type === 'alert').length;
  const warnings  = alertList.filter(a => a.type === 'warning').length;
  const sortedAlerts = [...alertList].sort((a, b) => priorityRank[a.type] - priorityRank[b.type]);

  const handleAction = (alert) => {
    if (alert.type === 'success') return;
    setModalAlert(alert);
  };

  const handleConfirm = () => {
    const id = modalAlert.id;
    setModalAlert(null);
    setProcessing(true);
    setToast('Connecting to irrigation controller');

    setTimeout(() => {
      setToast(null);
      setTimeout(() => {
        setAlertList(prev => prev.map(a =>
          a.id === id
            ? { ...a, type: 'success', message: 'Irrigation started - Field D drip system running at 6 L/hr for 4 hours. Est. completion: 22:30.', time: 'Just now', icon: 'OK' }
            : a
        ));
        setProcessing(false);
        setToast('Field D drip system running - Est. completion 22:30');
      }, 100);
    }, 2000);
  };

  return (
    <div style={{ padding: isMobile ? '18px 14px' : '28px 32px', width: '100%' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-strong)', margin: 0, marginBottom: 6 }}>
           Alerts & Notifications
        </h1>
        <div style={{ fontSize: 14, color: 'var(--text-soft)' }}>
          {critical} critical - {warnings} warnings - Updated in real-time
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {Object.entries(typeConfig).map(([type, cfg]) => {
          const count = alertList.filter(a => a.type === type).length;
          return (
            <div key={type} className="card" style={{ padding: '16px 18px', boxShadow: `inset 2px 0 ${cfg.color}` }}>
              <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cfg.label}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', color: cfg.color, lineHeight: 1 }}>{count}</div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 4 }}>{cfg.hint}</div>
            </div>
          );
        })}
      </div>

      {/* Alert list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sortedAlerts.map(alert => {
          const cfg = typeConfig[alert.type];
          const fieldTag = getFieldStyle(alert.field);
          return (
            <div key={alert.id} style={{
              padding: '16px 20px', borderRadius: 14,
              background: cfg.bg,
              boxShadow: `inset 0 1px ${cfg.border}80, inset 0 -1px ${cfg.border}4a, inset 3px 0 ${cfg.color}`,
              display: 'flex', gap: 14, alignItems: 'flex-start',
              flexDirection: isMobile ? 'column' : 'row',
              transition: 'all 0.5s ease',
            }}>
              <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{alert.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <span className={`chip ${alert.type === 'alert' ? 'chip-red' : alert.type === 'warning' ? 'chip-amber' : alert.type === 'success' ? 'chip-green' : 'chip-blue'}`} style={{ marginRight: 8 }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }}>{alert.field}</span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        marginLeft: 8,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: fieldTag.bg,
                        boxShadow: `inset 0 0 0 1px ${fieldTag.border}`,
                        color: fieldTag.color,
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {fieldTag.label}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-soft)', whiteSpace: 'nowrap', marginLeft: 10 }}>{alert.time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.5 }}>{alert.message}</div>
              </div>
              <div style={{ flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
                <button
                  onClick={() => handleAction(alert)}
                  style={{
                    background: `${cfg.color}20`, border: 'none', boxShadow: `inset 0 1px ${cfg.color}55`,
                    color: cfg.color, borderRadius: 7, padding: '5px 12px',
                    fontSize: 11, fontWeight: 600,
                    cursor: alert.type === 'success' ? 'default' : 'pointer',
                    fontFamily: 'Manrope, sans-serif', transition: 'all 0.2s',
                    width: isMobile ? '100%' : 'auto',
                  }}
                >
                  {alert.type === 'success' ? ' Done' : 'Action'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalAlert && (
        <IrrigationModal
          alert={modalAlert}
          onConfirm={handleConfirm}
          onCancel={() => setModalAlert(null)}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}


