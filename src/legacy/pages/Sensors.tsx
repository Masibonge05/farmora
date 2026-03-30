// @ts-nocheck
'use client';

import { sensorNodes as fallbackSensorNodes } from '../data/dummyData';
import { useDashboardData } from '../data/dashboard-provider';
import { Wifi, Battery, Signal, Clock, AlertTriangle, CheckCircle2, Radio, XCircle } from 'lucide-react';

const BatteryIcon = ({ level }) => {
  const color = level < 20 ? '#c85820' : level < 50 ? '#e8a020' : '#7ec87e';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 24, height: 12, border: `2px solid ${color}`, borderRadius: 3, position: 'relative', display: 'flex', alignItems: 'center', padding: 1 }}>
        <div style={{ width: `${level}%`, height: '100%', background: color, borderRadius: 1, maxWidth: '100%' }} />
        <div style={{ position: 'absolute', right: -5, top: 2, width: 3, height: 6, background: color, borderRadius: '0 2px 2px 0' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color }}>{level}%</span>
    </div>
  );
};

const signalColor = { Strong: '#7ec87e', Good: '#4a9e4a', Weak: '#e8a020', Poor: '#c85820', None: '#666' };

export default function Sensors() {
  const { data } = useDashboardData();
  const sourceSensors = Array.isArray(data?.sensorNodes) ? data.sensorNodes : fallbackSensorNodes;
  const allSensors = [
    ...sourceSensors,
    { id: 'SN-06', field: 'Field C', battery: 78, signal: 'Strong', lastPing: '3m ago', status: 'online' },
    { id: 'SN-07', field: 'Field D', battery: 8, signal: 'None', lastPing: '45m ago', status: 'offline' },
  ];

  const online = allSensors.filter(s => s.status === 'online').length;
  const warning = allSensors.filter(s => s.status === 'warning').length;
  const offline = allSensors.filter(s => s.status === 'offline').length;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Radio size={20} color="#80c0f0" />
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: 600, color: '#f0f4f0', margin: 0, marginBottom: 6 }}>
            IoT Sensor Network
          </h1>
        </div>
        <div style={{ fontSize: 14, color: '#8a9e8a' }}>ESP32-based sensor nodes · Real-time environmental monitoring</div>
      </div>

      {/* Status summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Nodes', val: allSensors.length, color: '#f0f4f0', Icon: Signal },
          { label: 'Online', val: online, color: '#7ec87e', Icon: CheckCircle2 },
          { label: 'Warning', val: warning, color: '#e8a020', Icon: AlertTriangle },
          { label: 'Offline', val: offline, color: '#c85820', Icon: XCircle },
        ].map((item) => (
          <div key={item.label} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <item.Icon size={22} color={item.color} />
            <div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '1.6rem', color: item.color, lineHeight: 1 }}>{item.val}</div>
              <div style={{ fontSize: 12, color: '#8a9e8a', marginTop: 2 }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sensor list */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 16 }}>
          All Sensor Nodes
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {allSensors.map(sensor => {
            const statusCol = sensor.status === 'online' ? '#7ec87e' : sensor.status === 'warning' ? '#e8a020' : '#c85820';
            return (
              <div key={sensor.id} style={{ 
                padding: '14px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${statusCol}30`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 14, color: '#f0f4f0' }}>{sensor.id}</div>
                    <div style={{ fontSize: 11, color: '#8a9e8a' }}>{sensor.field}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span className="status-dot" style={{ background: statusCol, boxShadow: `0 0 6px ${statusCol}` }}></span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: statusCol, textTransform: 'capitalize' }}>{sensor.status}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#8a9e8a', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Battery size={12} /> Battery
                    </span>
                    <BatteryIcon level={sensor.battery} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#8a9e8a', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Wifi size={12} /> Signal
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: signalColor[sensor.signal] || '#8a9e8a' }}>{sensor.signal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#8a9e8a', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> Last ping
                    </span>
                    <span style={{ fontSize: 11, color: '#f0f4f0' }}>{sensor.lastPing}</span>
                  </div>
                </div>

                {sensor.battery < 20 && (
                  <div style={{ marginTop: 10, padding: '6px 8px', background: 'rgba(200,88,32,0.15)', borderRadius: 6, fontSize: 11, color: '#f08060', display: 'flex', gap: 5, alignItems: 'center' }}>
                    <AlertTriangle size={11} /> Battery critical — replace soon
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Data transmission stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 16 }}>
            Network Health
          </div>
          {[
            { label: 'Data points collected today', val: '14,832', good: true },
            { label: 'Average transmission latency', val: '340ms', good: true },
            { label: 'Packet loss rate', val: '0.4%', good: true },
            { label: 'Uptime (30 days)', val: '99.1%', good: true },
            { label: 'Nodes needing maintenance', val: '2', good: false },
          ].map(stat => (
            <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(74,158,74,0.08)', fontSize: 13 }}>
              <span style={{ color: '#8a9e8a' }}>{stat.label}</span>
              <span style={{ fontWeight: 600, color: stat.good ? '#7ec87e' : '#e8a020' }}>{stat.val}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 16 }}>
            Add New Sensor Node
          </div>
          {[
            { label: 'Node ID', placeholder: 'e.g. SN-08' },
            { label: 'Assign to Field', placeholder: 'Select field...' },
            { label: 'GPS Coordinates', placeholder: '-24.6543, 29.8821' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#8a9e8a', display: 'block', marginBottom: 5 }}>{f.label}</label>
              <input 
                placeholder={f.placeholder}
                style={{ 
                  width: '100%', padding: '9px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,158,74,0.2)',
                  color: '#f0f4f0', fontSize: 13, outline: 'none', fontFamily: 'Poppins, sans-serif'
                }}
              />
            </div>
          ))}
          <button style={{ 
            width: '100%', padding: '10px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg, #2d6a2d, #4a9e4a)',
            color: '#f0f4f0', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
          }}>
            + Pair Sensor
          </button>
        </div>
      </div>
    </div>
  );
}
