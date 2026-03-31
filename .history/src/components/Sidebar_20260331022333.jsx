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

export default function Sidebar({ active, onNav, onAiOpen, isMobile, isOpen, onClose }) {
  const handleNavClick = (id) => {
    onNav(id);
    if (isMobile) {
      onClose?.();
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 30,
          }}
        />
      )}

      <aside
        style={{
          width: 236,
          minHeight: '100vh',
          flexShrink: 0,
          background: 'linear-gradient(180deg, rgba(14,27,14,0.96) 0%, rgba(8,16,8,0.98) 100%)',
          borderRight: '1px solid rgba(126,200,126,0.14)',
          display: 'flex',
          flexDirection: 'column',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: isMobile ? 40 : 10,
          transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          transition: 'transform 0.25s ease',
          boxShadow: isMobile ? '10px 0 28px rgba(0,0,0,0.38)' : 'none',
        }}
      >
      <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid rgba(126,200,126,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: 'linear-gradient(145deg, #7ec87e, #2d6a2d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              boxShadow: '0 8px 18px rgba(126,200,126,0.24)',
            }}
          >
            🌿
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 17,
                color: '#eef6ee',
                letterSpacing: '-0.01em',
              }}
            >
              Farmora
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#9fc49f',
                fontWeight: 700,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
              }}
            >
              Precision Ag
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 14px 10px' }}>
        <div
          style={{
            background: 'rgba(126,200,126,0.08)',
            border: '1px solid rgba(126,200,126,0.2)',
            borderRadius: 10,
            padding: '10px 12px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: '#8a9e8a',
              fontWeight: 700,
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
              color: '#eef6ee',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            Thabo&apos;s Farm
            <span style={{ fontSize: 10, color: '#b4d6b4' }}>▼</span>
          </div>
          <div style={{ fontSize: 11, color: '#8eb08e', marginTop: 2 }}>Limpopo, RSA · 10 ha</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '6px 10px', overflowY: 'auto' }}>
        <div
          style={{
            fontSize: 10,
            color: '#7f9b7f',
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
            onClick={() => handleNavClick(id)}
          >
            <Icon size={16} />
            {label}
          </div>
        ))}
      </nav>

      <div style={{ padding: '12px 10px 16px', borderTop: '1px solid rgba(126,200,126,0.12)' }}>
        <div className="nav-item" style={{ marginBottom: 4 }}>
          <Bell size={16} /> Notifications
          <span
            style={{
              marginLeft: 'auto',
              background: 'rgba(200,88,32,0.9)',
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
            background: 'rgba(58,140,200,0.12)',
            borderRadius: 12,
            border: '1px solid rgba(128,192,240,0.25)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: '#b9dbf8',
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
            onClick={() => {
              onAiOpen?.();
              if (isMobile) {
                onClose?.();
              }
            }}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #1f4f77, #3a8cc8)',
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
              boxShadow: '0 8px 20px rgba(58,140,200,0.22)',
              transition: 'all 0.2s',
            }}
          >
            💬 Ask Farmora AI
          </button>
        </div>
      </div>
      </aside>
    </>
  );
}