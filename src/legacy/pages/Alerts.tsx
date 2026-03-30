// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { alerts } from '../data/dummyData';
import { useDashboardData } from '../data/dashboard-provider';
import {
  AlertTriangle,
  BatteryWarning,
  Beaker,
  CheckCircle,
  CloudRain,
  Droplets,
  Info,
  LoaderCircle,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';

const typeConfig = {
  alert:   { color: '#c85820', bg: 'rgba(200,88,32,0.08)',  border: 'rgba(200,88,32,0.3)',  label: 'Critical', icon: XCircle },
  warning: { color: '#e8a020', bg: 'rgba(232,160,32,0.08)', border: 'rgba(232,160,32,0.3)', label: 'Warning',  icon: AlertTriangle },
  info:    { color: '#80c0f0', bg: 'rgba(58,140,200,0.08)', border: 'rgba(58,140,200,0.3)', label: 'Info',     icon: Info },
  success: { color: '#7ec87e', bg: 'rgba(74,158,74,0.08)',  border: 'rgba(74,158,74,0.3)',  label: 'Resolved', icon: CheckCircle },
};

function IrrigationModal({ alert, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,30,15,0.99), rgba(8,18,8,0.99))',
        border: '1px solid rgba(74,158,74,0.3)', borderRadius: 20,
        padding: '32px 36px', maxWidth: 440, width: '90%',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        animation: 'slide-in 0.25s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: 'rgba(58,140,200,0.18)', border: '1px solid rgba(58,140,200,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Droplets size={22} color="#80c0f0" />
            </div>
            <div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 17, color: '#f0f4f0' }}>Start Irrigation</div>
              <div style={{ fontSize: 12, color: '#8a9e8a' }}>{alert.field}</div>
            </div>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#8a9e8a', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{
          padding: '14px 16px', borderRadius: 12, marginBottom: 24,
          background: 'rgba(200,88,32,0.1)', border: '1px solid rgba(200,88,32,0.25)',
        }}>
          <div style={{ fontSize: 13, color: '#f0d0c0', lineHeight: 1.6 }}>{alert.message}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 24 }}>
          {[
            { label: 'Target Field',    val: alert.field },
            { label: 'Flow Rate',       val: '6 L/hr per emitter' },
            { label: 'Duration',        val: '4 hours' },
            { label: 'Est. water use',  val: '~144 L total' },
            { label: 'Target moisture', val: '55–65%' },
          ].map(r => (
            <div key={r.label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '9px 0', borderBottom: '1px solid rgba(74,158,74,0.08)', fontSize: 12,
            }}>
              <span style={{ color: '#8a9e8a' }}>{r.label}</span>
              <span style={{ color: '#f0f4f0', fontWeight: 600 }}>{r.val}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px', borderRadius: 10, cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#8a9e8a', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 2, padding: '11px', borderRadius: 10, cursor: 'pointer', border: 'none',
            background: 'linear-gradient(135deg, #1a5a8a, #3a8cc8)',
            color: '#f0f4f0', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif',
            boxShadow: '0 4px 20px rgba(58,140,200,0.35)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Droplets size={14} />
            Confirm - Start Irrigation
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  const isProcessing = message.startsWith('[processing]');
  const color = isProcessing ? '#e8a020' : '#7ec87e';
  const cleanMessage = isProcessing ? message.replace('[processing] ', '') : message;

  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 2000,
      background: 'linear-gradient(135deg, rgba(12,28,12,0.99), rgba(8,18,8,0.99))',
      border: `1px solid ${color}60`, borderRadius: 16,
      padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: `0 8px 40px ${color}25`,
      animation: 'slide-in 0.3s ease',
      minWidth: 300, maxWidth: 380,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isProcessing ? <LoaderCircle size={18} color={color} className="animate-float" /> : <CheckCircle size={20} color={color} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#f0f4f0' }}>
          {isProcessing ? 'Processing...' : 'Irrigation Started'}
        </div>
        <div style={{ fontSize: 12, color, marginTop: 3, lineHeight: 1.4 }}>{cleanMessage}</div>
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
  const { data } = useDashboardData();
  const sourceAlerts = Array.isArray(data?.alerts) ? data.alerts : alerts;
  const baseAlerts = [
    ...sourceAlerts,
    { id: 5, type: 'alert', field: 'Field D', message: 'Sensor SN-04 battery at 15% - data collection at risk', time: '12 min ago', icon: BatteryWarning },
    { id: 6, type: 'warning', field: 'Field B', message: 'Soil pH dropped to 6.1 - approaching acidic threshold for tomatoes', time: '2h ago', icon: Beaker },
    { id: 7, type: 'info', field: 'All Fields', message: 'Rain forecast Wednesday-Thursday (70-85%). Adjust irrigation schedules.', time: '4h ago', icon: CloudRain },
    { id: 8, type: 'success', field: 'System', message: 'Weekly AI model update completed - disease detection accuracy improved to 94%', time: '1d ago', icon: Sparkles },
  ];

  const [alertList, setAlertList]   = useState(baseAlerts);
  const [modalAlert, setModalAlert] = useState(null);
  const [toast, setToast]           = useState(null);

  useEffect(() => {
    setAlertList(baseAlerts);
  }, [data?.alerts]);

  const critical = alertList.filter(a => a.type === 'alert').length;
  const warnings  = alertList.filter(a => a.type === 'warning').length;

  const handleAction = (alert) => {
    if (alert.type === 'success') return;
    setModalAlert(alert);
  };

  const handleConfirm = () => {
    const id = modalAlert.id;
    setModalAlert(null);
    setToast('[processing] Connecting to irrigation controller...');

    setTimeout(() => {
      setToast(null);
      setTimeout(() => {
        setAlertList(prev => prev.map(a =>
          a.id === id
            ? { ...a, type: 'success', message: 'Irrigation started - Field D drip system running at 6 L/hr for 4 hours. Est. completion: 22:30.', time: 'Just now', icon: Droplets }
            : a
        ));
        setToast('Field D drip system running · Est. completion 22:30');
      }, 100);
    }, 2000);
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.6rem', fontWeight: 600, color: '#f0f4f0', margin: 0, marginBottom: 6 }}>
          Alerts & Notifications
        </h1>
        <div style={{ fontSize: 14, color: '#8a9e8a' }}>
          {critical} critical · {warnings} warnings · Updated in real-time
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {Object.entries(typeConfig).map(([type, cfg]) => {
          const count = alertList.filter(a => a.type === type).length;
          return (
            <div key={type} className="card" style={{ padding: '16px 18px', borderLeft: `3px solid ${cfg.color}` }}>
              <div style={{ fontSize: 12, color: '#8a9e8a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cfg.label}</div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '2rem', color: cfg.color, lineHeight: 1 }}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Alert list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {alertList.map(alert => {
          const cfg = typeConfig[alert.type];
          const Icon = typeof alert.icon === 'function' ? alert.icon : cfg.icon;
          return (
            <div key={alert.id} style={{
              padding: '16px 20px', borderRadius: 14,
              background: cfg.bg, border: `1px solid ${cfg.border}`,
              display: 'flex', gap: 14, alignItems: 'flex-start',
              transition: 'all 0.5s ease',
            }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <Icon size={22} color={cfg.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <span className={`chip ${alert.type === 'alert' ? 'chip-red' : alert.type === 'warning' ? 'chip-amber' : alert.type === 'success' ? 'chip-green' : 'chip-blue'}`} style={{ marginRight: 8 }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f4f0' }}>{alert.field}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#4a6e4a', whiteSpace: 'nowrap', marginLeft: 10 }}>{alert.time}</span>
                </div>
                <div style={{ fontSize: 13, color: '#c0d0c0', lineHeight: 1.5 }}>{alert.message}</div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <button
                  onClick={() => handleAction(alert)}
                  style={{
                    background: `${cfg.color}20`, border: `1px solid ${cfg.color}40`,
                    color: cfg.color, borderRadius: 7, padding: '5px 12px',
                    fontSize: 11, fontWeight: 600,
                    cursor: alert.type === 'success' ? 'default' : 'pointer',
                    fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s',
                  }}
                >
                  {alert.type === 'success' ? '✓ Done' : 'Action'}
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
