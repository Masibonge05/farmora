import {
  LayoutDashboard, Leaf, Droplets, AlertTriangle,
  ShoppingCart, Wifi, CloudRain, Settings, Bell, LogOut
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: Leaf, label: 'Crop Health', id: 'crop-health' },
  { icon: Droplets, label: 'Soil & Water', id: 'soil' },
  { icon: AlertTriangle, label: 'Alerts', id: 'alerts' },
  { icon: ShoppingCart, label: 'Market Prices', id: 'market' },
  { icon: Wifi, label: 'IoT Sensors', id: 'sensors' },
  { icon: CloudRain, label: 'Weather', id: 'weather' },
];

export default function Sidebar({ active, onNav, onAiOpen }) {
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
      }}
    >
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(74,158,74,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2d6a2d, #7ec87e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            🌿
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 18,
                color: '#f0f4f0',
                letterSpacing: '-0.02em',
              }}
            >
              Farmora
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#4a9e4a',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Precision Ag
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px 12px' }}>
        <div
          style={{
            background: 'rgba(74,158,74,0.1)',
            border: '1px solid rgba(74,158,74,0.2)',
            borderRadius: 10,
            padding: '10px 12px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: '#8a9e8a',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 3,
            }}
          >
            Active Farm
          </div>
          <div
            style={{
              fontSize: 13,
              color: '#f0f4f0',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            Thabo&apos;s Farm
            <span style={{ fontSize: 10, color: '#7ec87e' }}>▼</span>
          </div>
          <div style={{ fontSize: 11, color: '#4a9e4a', marginTop: 2 }}>Limpopo, RSA · 10 ha</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '4px 12px', overflowY: 'auto' }}>
        <div
          style={{
            fontSize: 10,
            color: '#4a6e4a',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '8px 4px 6px',
          }}
        >
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
      </nav>

      <div style={{ padding: '12px 12px 20px', borderTop: '1px solid rgba(74,158,74,0.1)' }}>
        <div className="nav-item" style={{ marginBottom: 4 }}>
          <Bell size={16} /> Notifications
          <span
            style={{
              marginLeft: 'auto',
              background: '#c85820',
              borderRadius: 8,
              padding: '1px 6px',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            3
          </span>
        </div>

        <div className="nav-item" style={{ marginBottom: 4 }}>
          <Settings size={16} /> Settings
        </div>

        <div className="nav-item" style={{ color: '#c85820' }}>
          <LogOut size={16} /> Sign Out
        </div>

        <div
          style={{
            marginTop: 16,
            padding: '14px',
            background: 'rgba(58,140,200,0.08)',
            borderRadius: 12,
            border: '1px solid rgba(58,140,200,0.2)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: '#80c0f0',
              fontWeight: 700,
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            AI Assistant
          </div>

          <div style={{ fontSize: 11, color: '#8a9e8a', marginBottom: 10, lineHeight: 1.5 }}>
            Ask about your crops, market prices, or field health
          </div>

          <button
            type="button"
            onClick={() => onAiOpen?.()}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #1a3a5a, #3a8cc8)',
              border: 'none',
              borderRadius: 8,
              padding: '9px 12px',
              fontSize: 12,
              fontWeight: 700,
              color: '#f0f4f0',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 4px 14px rgba(58,140,200,0.25)',
              transition: 'all 0.2s',
            }}
          >
            💬 Ask Farmora AI
          </button>
        </div>
      </div>
    </aside>
  );
}