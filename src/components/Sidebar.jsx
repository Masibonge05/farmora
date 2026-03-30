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

export default function Sidebar({ active, onNav }) {
  return (
    <aside style={{ 
      width: 220, minHeight: '100vh', flexShrink: 0,
      background: 'linear-gradient(180deg, rgba(20,36,20,0.98) 0%, rgba(10,18,10,0.98) 100%)',
      borderRight: '1px solid rgba(74,158,74,0.12)',
      display: 'flex', flexDirection: 'column',
      padding: '0',
      position: 'sticky', top: 0, height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(74,158,74,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #2d6a2d, #7ec87e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18
          }}>🌿</div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#f0f4f0', letterSpacing: '-0.02em' }}>
              Farmora
            </div>
            <div style={{ fontSize: 10, color: '#4a9e4a', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Precision Ag
            </div>
          </div>
        </div>
      </div>

      {/* Farm selector */}
      <div style={{ padding: '14px 16px 12px' }}>
        <div style={{ 
          background: 'rgba(74,158,74,0.1)', border: '1px solid rgba(74,158,74,0.2)',
          borderRadius: 10, padding: '10px 12px', cursor: 'pointer'
        }}>
          <div style={{ fontSize: 10, color: '#8a9e8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
            Active Farm
          </div>
          <div style={{ fontSize: 13, color: '#f0f4f0', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Thabo's Farm
            <span style={{ fontSize: 10, color: '#7ec87e' }}>▼</span>
          </div>
          <div style={{ fontSize: 11, color: '#4a9e4a', marginTop: 2 }}>Limpopo, RSA · 10 ha</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, color: '#4a6e4a', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 4px 6px' }}>
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

      {/* Bottom */}
      <div style={{ padding: '12px 12px 20px', borderTop: '1px solid rgba(74,158,74,0.1)' }}>
        <div className="nav-item" style={{ marginBottom: 4 }}>
          <Bell size={16} /> Notifications
          <span style={{ marginLeft: 'auto', background: '#c85820', borderRadius: 8, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>3</span>
        </div>
        <div className="nav-item" style={{ marginBottom: 4 }}>
          <Settings size={16} /> Settings
        </div>
        <div className="nav-item" style={{ color: '#c85820' }}>
          <LogOut size={16} /> Sign Out
        </div>
        <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(74,158,74,0.06)', borderRadius: 10, border: '1px solid rgba(74,158,74,0.12)' }}>
          <div style={{ fontSize: 10, color: '#4a9e4a', fontWeight: 600, marginBottom: 4 }}>AI Assistant</div>
          <div style={{ fontSize: 11, color: '#8a9e8a' }}>Ask about your crops, market prices, or field health</div>
          <div style={{ marginTop: 8, background: 'rgba(74,158,74,0.2)', borderRadius: 6, padding: '6px 10px', fontSize: 11, color: '#7ec87e', cursor: 'pointer', textAlign: 'center' }}>
            💬 Ask Farmora AI
          </div>
        </div>
      </div>
    </aside>
  );
}
