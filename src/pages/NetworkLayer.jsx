/**
 * LAYER 2 — Network / Communication Layer Dashboard
 * --------------------------------------------------
 * NetworkLayer.jsx
 *
 * Visual representation of the entire Layer 2 communication stack:
 *   • Live status for Firebase RTDB (WebSocket), SSE, and REST/HTTP transports
 *   • Packet throughput metrics and latency readings
 *   • Data-flow diagram showing the path from edge sensors to the cloud
 *   • Rolling log of the last received packets
 *   • Overall network health indicator
 */

import { useSelector } from 'react-redux';
import {
  Activity, Radio, Wifi, Globe, Database, Zap,
  RefreshCw, CheckCircle2, AlertTriangle, XCircle,
  ArrowRight, ArrowDown, Clock, BarChart2, Layers,
} from 'lucide-react';
import useMediaQuery from '../lib/useMediaQuery';
import useTransportManager from '../lib/layer2/transportManager';
import {
  selectNetworkHealth,
  selectActiveTransport,
  selectTransports,
  selectRecentPackets,
  selectTotalPackets,
  selectSessionStart,
} from '../store/networkSlice';

// ─── Colour palette (greyscale + accent, matches the app theme) ──────────────

const HEALTH_COLOR = {
  healthy:  { text: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.4)'   },
  degraded: { text: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.4)'  },
  offline:  { text: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.4)'   },
};

const STATUS_COLOR = {
  connected:    '#22c55e',
  connecting:   '#3b82f6',
  reconnecting: '#f59e0b',
  error:        '#ef4444',
  disconnected: '#94a3b8',
  closed:       '#94a3b8',
  idle:         '#94a3b8',
};

const PROTOCOL_META = {
  firebase: {
    label:    'Firebase RTDB',
    protocol: 'WebSocket',
    icon:     Database,
    badge:    'WS',
    desc:     'Persistent TCP connection — sub-100 ms push delivery',
    role:     'Primary fallback / persistent state',
    layer:    'Cloud',
  },
  sse: {
    label:    'Vercel API Gateway',
    protocol: 'SSE',
    icon:     Radio,
    badge:    'SSE',
    desc:     'HTTP/1.1 chunked streaming — text/event-stream',
    role:     'Primary real-time feed from MQTT broker',
    layer:    'Cloud Edge',
  },
  rest: {
    label:    'REST / HTTP',
    protocol: 'HTTP/REST',
    icon:     Globe,
    badge:    'HTTP',
    desc:     'Request/response — used for initial hydration',
    role:     'Initial data load + weather API',
    layer:    'Cloud',
  },
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function NetworkLayer() {
  const isMobile  = useMediaQuery('(max-width: 768px)');
  const isTablet  = useMediaQuery('(max-width: 1100px)');

  // Activate all transports (this will update Redux state as connections
  // are established, providing live feedback in the UI)
  const { activeTransport: managerActive } = useTransportManager({ farmId: 'thabo-farm' });

  // Read shared Redux network state (also written to by Overview / other pages
  // that call useTransportManager or useRealtimeFarmFeed)
  const health        = useSelector(selectNetworkHealth);
  const activeTx      = useSelector(selectActiveTransport);
  const transports    = useSelector(selectTransports);
  const recentPackets = useSelector(selectRecentPackets);
  const totalPackets  = useSelector(selectTotalPackets);
  const sessionStart  = useSelector(selectSessionStart);

  const uptimeSec = sessionStart ? Math.floor((Date.now() - sessionStart) / 1000) : 0;
  const uptimeStr = formatUptime(uptimeSec);

  const healthStyle = HEALTH_COLOR[health] ?? HEALTH_COLOR.offline;

  return (
    <div style={{ padding: isMobile ? '18px 14px' : '28px 32px', width: '100%' }}>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem',
          fontWeight: 800, color: 'var(--text-strong)', margin: 0, marginBottom: 6,
        }}>
          Network Communication Layer
        </h1>
        <div style={{ fontSize: 14, color: 'var(--text-soft)' }}>
          Layer 2 — Protocol management, transport health &amp; real-time data ingestion
        </div>
      </div>

      {/* ── Summary bar ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
        gap: 14, marginBottom: 28,
      }}>
        <StatCard
          icon={<Activity size={18} />}
          label="Network Health"
          value={capitalize(health)}
          valueStyle={{ color: healthStyle.text }}
          accent={healthStyle.text}
        />
        <StatCard
          icon={<Radio size={18} />}
          label="Active Transport"
          value={activeTx === 'idle' ? '—' : PROTOCOL_META[activeTx]?.badge ?? activeTx.toUpperCase()}
          accent="#3b82f6"
        />
        <StatCard
          icon={<BarChart2 size={18} />}
          label="Total Packets"
          value={totalPackets.toLocaleString()}
          accent="#8b5cf6"
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Session Uptime"
          value={uptimeStr}
          accent="#06b6d4"
        />
        <StatCard
          icon={<Layers size={18} />}
          label="Transports Active"
          value={`${countConnected(transports)} / 3`}
          accent="#22c55e"
        />
      </div>

      {/* ── Data-flow architecture diagram ─────────────────────────────── */}
      <div className="card" style={{ padding: '22px 24px', marginBottom: 24 }}>
        <SectionTitle icon={<Zap size={15} />} title="Data Flow — Edge to Cloud" />
        <DataFlowDiagram isMobile={isMobile} activeTx={activeTx} />
      </div>

      {/* ── Transport cards ─────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: 16, marginBottom: 24,
      }}>
        {['firebase', 'sse', 'rest'].map((name) => (
          <TransportCard
            key={name}
            name={name}
            meta={PROTOCOL_META[name]}
            state={transports[name] ?? {}}
            isActive={activeTx === name}
          />
        ))}
      </div>

      {/* ── Recent packet log ───────────────────────────────────────────── */}
      <div className="card" style={{ padding: '22px 24px' }}>
        <SectionTitle icon={<Activity size={15} />} title="Recent Packets" subtitle={`Last ${recentPackets.length} of ${totalPackets} total`} />
        {recentPackets.length === 0 ? (
          <div style={{ color: 'var(--text-soft)', fontSize: 13, padding: '12px 0' }}>
            Waiting for first packet…
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
            {recentPackets.slice(0, 12).map((p) => (
              <PacketRow key={p.packetId} packet={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, valueStyle = {}, accent = '#64748b' }) {
  return (
    <div className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: `${accent}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accent, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--text-soft)', marginBottom: 2 }}>{label}</div>
        <div style={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 800,
          fontSize: '1.2rem', color: 'var(--text-strong)', lineHeight: 1.1,
          ...valueStyle,
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <span style={{ color: 'var(--text-soft)' }}>{icon}</span>
      <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)' }}>
        {title}
      </span>
      {subtitle && (
        <span style={{ fontSize: 12, color: 'var(--text-soft)', marginLeft: 4 }}>{subtitle}</span>
      )}
    </div>
  );
}

function TransportCard({ name, meta, state, isActive }) {
  const Icon    = meta.icon;
  const sc      = STATUS_COLOR[state.status] ?? '#94a3b8';
  const latency = state.latencyMs !== null ? `${state.latencyMs} ms` : '–';
  const age     = state.lastEventAt ? timeAgo(state.lastEventAt) : 'Never';

  return (
    <div className="card" style={{
      padding: '18px 20px',
      boxShadow: isActive ? `inset 0 0 0 2px ${sc}55` : undefined,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: `${sc}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sc,
          }}>
            <Icon size={18} />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-strong)' }}>
              {meta.label}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-soft)' }}>{meta.layer}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <StatusBadge status={state.status ?? 'idle'} />
          {isActive && (
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
              color: '#22c55e', background: 'rgba(34,197,94,0.14)',
              padding: '1px 6px', borderRadius: 4,
            }}>
              PRIMARY
            </span>
          )}
        </div>
      </div>

      {/* Protocol badge */}
      <div style={{
        display: 'inline-block',
        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
        color: sc, background: `${sc}18`,
        padding: '2px 8px', borderRadius: 5, marginBottom: 12,
      }}>
        {meta.badge} · {meta.protocol}
      </div>

      {/* Description */}
      <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 14, lineHeight: 1.5 }}>
        {meta.desc}
      </div>

      {/* Metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <Metric label="Packets" value={(state.messageCount ?? 0).toLocaleString()} />
        <Metric label="Latency" value={latency} />
        <Metric label="Last Event" value={age} />
      </div>

      {/* Role */}
      <div style={{
        marginTop: 12, fontSize: 11, color: 'var(--text-soft)',
        borderTop: '1px solid var(--border-default)', paddingTop: 10,
      }}>
        <strong style={{ color: 'var(--text-base)' }}>Role:</strong> {meta.role}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const color = STATUS_COLOR[status] ?? '#94a3b8';
  const Icon =
    status === 'connected'    ? CheckCircle2 :
    status === 'reconnecting' ? RefreshCw    :
    status === 'error'        ? XCircle      :
    status === 'connecting'   ? RefreshCw    :
                                AlertTriangle;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color }}>
      <Icon size={13} />
      <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {status}
      </span>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{
      background: 'rgba(148,163,184,0.07)', borderRadius: 8,
      padding: '8px 10px', textAlign: 'center',
    }}>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-strong)' }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-soft)', marginTop: 1 }}>{label}</div>
    </div>
  );
}

function PacketRow({ packet }) {
  const sc      = STATUS_COLOR[packet.quality === 'ok' ? 'connected' : 'error'];
  const srcMeta = PROTOCOL_META[packet.source];
  const badge   = srcMeta?.badge ?? packet.source?.toUpperCase() ?? '?';
  const latency = packet.latencyMs !== null ? `${packet.latencyMs} ms` : '–';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 10px', borderRadius: 8,
      background: 'rgba(148,163,184,0.06)',
      fontSize: 12,
    }}>
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.07em',
        color: sc, background: `${sc}18`,
        padding: '2px 7px', borderRadius: 4, flexShrink: 0,
        minWidth: 40, textAlign: 'center',
      }}>
        {badge}
      </span>
      <span style={{ color: 'var(--text-soft)', flexShrink: 0 }}>
        {new Date(packet.receivedAt).toLocaleTimeString()}
      </span>
      <span style={{ color: 'var(--text-base)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {packet.packetId}
      </span>
      <span style={{ color: 'var(--text-soft)', flexShrink: 0 }}>{latency}</span>
      <span style={{
        fontSize: 10, color: sc, background: `${sc}14`,
        padding: '1px 6px', borderRadius: 4, flexShrink: 0,
      }}>
        {packet.quality}
      </span>
    </div>
  );
}

// ─── Data-flow diagram ────────────────────────────────────────────────────────

function DataFlowDiagram({ isMobile, activeTx }) {
  const nodes = [
    { label: 'ESP32 Sensors',  sub: 'Layer 1 — Edge',   icon: <Wifi size={16} />,     color: '#f59e0b', layer: 1 },
    { label: 'MQTT Broker',    sub: 'Edge → Cloud',      icon: <Radio size={16} />,    color: '#3b82f6', layer: 2 },
    { label: 'API Gateway',    sub: 'Vercel — SSE/REST', icon: <Globe size={16} />,    color: '#8b5cf6', layer: 2 },
    { label: 'Firebase RTDB',  sub: 'WebSocket — Cloud', icon: <Database size={16} />, color: '#ef4444', layer: 2 },
    { label: 'React Dashboard',sub: 'Layer 5 — UI',      icon: <Activity size={16} />, color: '#22c55e', layer: 5 },
  ];

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {nodes.map((n, i) => (
          <div key={n.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FlowNode {...n} />
            {i < nodes.length - 1 && (
              <div style={{ height: 24, width: 2, background: 'var(--border-default)', margin: '0 auto' }} />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4 }}>
      {nodes.map((n, i) => (
        <div key={n.label} style={{ display: 'flex', alignItems: 'center' }}>
          <FlowNode {...n} />
          {i < nodes.length - 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 4px' }}>
              <ArrowRight size={18} style={{ color: 'var(--text-soft)' }} />
              {i === 0 && <span style={{ fontSize: 9, color: 'var(--text-soft)', marginTop: 2 }}>MQTT</span>}
              {i === 1 && <span style={{ fontSize: 9, color: 'var(--text-soft)', marginTop: 2 }}>SSE</span>}
              {i === 2 && <span style={{ fontSize: 9, color: 'var(--text-soft)', marginTop: 2 }}>WS</span>}
              {i === 3 && <span style={{ fontSize: 9, color: 'var(--text-soft)', marginTop: 2 }}>Redux</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FlowNode({ label, sub, icon, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '10px 14px', borderRadius: 12,
      background: `${color}10`,
      border: `1.5px solid ${color}35`,
      minWidth: 110, textAlign: 'center',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: `${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, marginBottom: 6,
      }}>
        {icon}
      </div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--text-strong)' }}>
        {label}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-soft)', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function countConnected(transports) {
  return Object.values(transports).filter((t) => t.status === 'connected').length;
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 5_000)  return 'just now';
  if (diff < 60_000) return `${Math.floor(diff / 1_000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

function formatUptime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h}h ${rm}m`;
}
