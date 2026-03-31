import {
  LayoutDashboard, Leaf, Droplets, AlertTriangle,
  ShoppingCart, Wifi, CloudRain, Rocket, LogOut
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
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: Leaf, label: 'Crop Health', id: 'crop-health' },
  { icon: Droplets, label: 'Soil & Water', id: 'soil' },
  { icon: AlertTriangle, label: 'Alerts', id: 'alerts' },
  { icon: Rocket, label: 'Farmora AI', id: 'farmora-ai' },
  { icon: ShoppingCart, label: 'Market Prices', id: 'market' },
  { icon: Wifi, label: 'IoT Sensors', id: 'sensors' },
  { icon: CloudRain, label: 'Weather', id: 'weather' },
];

export default function Sidebar({ active, onNav, onAiOpen, weather }) {
export default function Sidebar({
  active,
  onNav,
  onAiOpen,
  isMobile,
  isOpen,
  onClose,
  userName,
  userEmail,
  avatarLetter,
  onSignOut,
}) {
  const handleNavClick = (id) => {
    onNav(id);
    if (isMobile) {
      onClose?.();
    }
  };

  const handleSignOutClick = async () => {
    await onSignOut?.();
    if (isMobile) {
      onClose?.();
    }
  };

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
        className="app-sidebar"
        style={{
          width: 244,
          minHeight: '100vh',
          flexShrink: 0,
          background: 'var(--panel-bg)',
          display: 'flex',
          flexDirection: 'column',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: isMobile ? 40 : 10,
          transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          transition: 'transform 0.25s ease',
          boxShadow: isMobile ? '10px 0 28px rgba(0,0,0,0.14)' : 'none',
        }}
      >
      <div style={{ padding: '24px 18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: 'var(--surface-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              color: 'var(--control-text)'
            }}
          >
            {avatarLetter || 'U'}
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 700,
                fontSize: 17,
                color: 'var(--text-strong)',
                letterSpacing: '-0.01em',
              }}
            >
              Farmora
            </div>
            <div
              style={{
                fontSize: 10,
                color: 'var(--text-soft)',
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
      <div style={{ padding: '14px 14px 10px' }}>
        <div
          style={{
            background: 'var(--surface-strong)',
            borderRadius: 12,
            padding: '12px 12px',
            cursor: 'pointer',
            boxShadow: '0 6px 14px rgba(148,163,184,0.08)'
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: 'var(--text-soft)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 3,
            }}
          >
            Account
          </div>
  {weather && ` · ${weather.icon} ${weather.temp}°C`}
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-strong)',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {userName || 'Farmora User'}
            <span style={{ fontSize: 10, color: 'var(--text-soft)' }}>v</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {userEmail || 'No email'}
          </div>
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
      <nav style={{ flex: 1, padding: '8px 10px', overflowY: 'auto' }}>
        <div
          style={{
            fontSize: 10,
            color: 'var(--text-soft)',
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
      </nav>

      <div style={{ padding: '10px 10px 14px' }}>
        <button
          type="button"
          onClick={handleSignOutClick}
          className="nav-item"
          style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent' }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>


      </aside>
    </>
  );
}


