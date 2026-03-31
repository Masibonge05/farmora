import {
  LayoutDashboard, Leaf, Droplets, AlertTriangle,
  ShoppingCart, Wifi, CloudRain, Settings, Bell, LogOut
} from 'lucide-react';

import farmoraLogo from '../assets/farmora-logo.jpeg';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview',      id: 'overview'    },
  { icon: Leaf,            label: 'Crop Health',   id: 'crop-health' },
  { icon: Droplets,        label: 'Soil & Water',  id: 'soil'        },
  { icon: AlertTriangle,   label: 'Alerts',        id: 'alerts'      },
  { icon: ShoppingCart,    label: 'Market Prices', id: 'market'      },
  { icon: Wifi,            label: 'IoT Sensors',   id: 'sensors'     },
  { icon: CloudRain,       label: 'Weather',       id: 'weather'     },
];

export default function Sidebar({ active, onNav, onAiOpen, weather }) {
  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        flexShrink: 0,
        background: 'linear-gradient(180deg, rgba(20,36,20,0.98) 0%, rgba(10,18,10,0.98) 100%)',
        borderRight: '1px solid rgba(74,158,74,0.12)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden', // prevent the aside itself from scrolling
      }}
    >
  {/* ── Logo ── */}
<div style={{
  padding: '16px 20px 14px',
  borderBottom: '1px solid rgba(74,158,74,0.1)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
}}>
  <div style={{
    background: 'rgba(74,158,74,0.08)',
    border: '1px solid rgba(74,158,74,0.18)',
    borderRadius: 16,
    padding: '8px 14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <img
      src={farmoraLogo}
      alt="Farmora"
      style={{
        width: 100,
        display: 'block',
        borderRadius: 10,
        filter: 'drop-shadow(0 0 10px rgba(74,158,74,0.3))',
      }}
    />
  </div>
</div>

      {/* ── Farm selector — compact ── */}
      <div style={{ padding: '10px 12px 8px', flexShrink: 0 }}>
        <div style={{
          background: 'rgba(74,158,74,0.1)',
          border: '1px solid rgba(74,158,74,0.2)',
          borderRadius: 10,
          padding: '8px 12px',
          cursor: 'pointer',
        }}>
          <div style={{ fontSize: 10, color: '#8a9e8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
            Active Farm
          </div>
  {weather && ` · ${weather.icon} ${weather.temp}°C`}
        </div>
      </div>

      {/* ── Scrollable area: nav + utilities ── */}
      <nav style={{
        flex: 1,
        padding: '4px 12px',
        overflowY: 'auto',
        overflowX: 'hidden',
        // custom scrollbar styling
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(74,158,74,0.25) transparent',
      }}>
        {/* Main nav label */}
        <div style={{ fontSize: 10, color: '#4a6e4a', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 4px 4px' }}>
          Main Menu
        </div>

        {navItems.map(({ icon: Icon, label, id }) => (
          <div
            key={id}
            className={`nav-item ${active === id ? 'active' : ''}`}
            onClick={() => onNav(id)}
          >
            <Icon size={16} />
            {label}
          </div>
        ))}

        {/* Divider before utilities */}
        <div style={{ height: 1, background: 'rgba(74,158,74,0.08)', margin: '10px 4px 8px' }} />

        {/* Utilities label */}
        <div style={{ fontSize: 10, color: '#4a6e4a', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 4px 4px' }}>
          Account
        </div>

        {/* Notifications — now scrolls with nav */}
        <div className="nav-item">
          <Bell size={16} /> Notifications
          <span style={{
            marginLeft: 'auto',
            background: '#c85820',
            borderRadius: 8,
            padding: '1px 6px',
            fontSize: 10,
            fontWeight: 700,
            color: '#fff',
          }}>3</span>
        </div>

        <div className="nav-item">
          <Settings size={16} /> Settings
        </div>

        <div className="nav-item" style={{ color: '#c85820', marginBottom: 8 }}>
          <LogOut size={16} /> Sign Out
        </div>
      </nav>

      {/* ── AI Assistant — pinned to bottom, never scrolls away ── */}
      <div style={{
        padding: '10px 12px 16px',
        borderTop: '1px solid rgba(74,158,74,0.1)',
        flexShrink: 0,
      }}>
        <div style={{
          padding: '12px',
          background: 'rgba(58,140,200,0.08)',
          borderRadius: 12,
          border: '1px solid rgba(58,140,200,0.2)',
        }}>
          <div style={{ fontSize: 10, color: '#80c0f0', fontWeight: 700, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            AI Assistant
          </div>
          <div style={{ fontSize: 11, color: '#8a9e8a', marginBottom: 8, lineHeight: 1.45 }}>
            Ask about your crops, market or field health
          </div>
          <button
            type="button"
            onClick={() => onAiOpen?.()}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #1a3a5a, #3a8cc8)',
              border: 'none', borderRadius: 8, padding: '8px 12px',
              fontSize: 12, fontWeight: 700, color: '#f0f4f0', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: '0 4px 14px rgba(58,140,200,0.25)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(58,140,200,0.4)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(58,140,200,0.25)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            💬 Ask Farmora AI
          </button>
        </div>
      </div>
    </aside>
  );
}