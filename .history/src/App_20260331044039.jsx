import { useState, useContext, useEffect } from 'react';
import {
  House,
  Sprout,
  Droplets,
  TriangleAlert,
  ShoppingCart,
  Wifi,
  CloudRain,
  Bot,
  Search,
  Mail,
  Bell,
  ChevronDown,
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import CropHealth from './pages/CropHealth';
import SoilWater from './pages/SoilWater';
import Market from './pages/Market';
import Sensors from './pages/Sensors';
import Alerts from './pages/Alerts';
import Weather from './pages/Weather';
import FarmoraAIPage from './pages/FarmoraAIPage';
import AuthContext from './contexts/AuthContext';
import Login from './components/Login';
import useMediaQuery from './lib/useMediaQuery';

const pageMap = {
  overview: Overview,
  'crop-health': CropHealth,
  soil: SoilWater,
  market: Market,
  sensors: Sensors,
  alerts: Alerts,
  weather: Weather,
  'farmora-ai': FarmoraAIPage,
};

const pageTitleMap = {
  overview: 'Farm Overview',
  'crop-health': 'Crop Health',
  soil: 'Soil & Water',
  market: 'Market Prices',
  sensors: 'IoT Sensors',
  alerts: 'Alerts',
  weather: 'Weather',
  'farmora-ai': 'Farmora AI',
};

const topNavItems = [
  { id: 'overview', label: 'Overview', icon: House },
  { id: 'crop-health', label: 'Crop Health', icon: Sprout },
  { id: 'soil', label: 'Soil & Water', icon: Droplets },
  { id: 'alerts', label: 'Alerts', icon: TriangleAlert },
  { id: 'market', label: 'Market', icon: ShoppingCart },
  { id: 'sensors', label: 'Sensors', icon: Wifi },
  { id: 'weather', label: 'Weather', icon: CloudRain },
];

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('farmora-theme') === 'dark');
  const { user, loading } = useContext(AuthContext);
  const isMobile = useMediaQuery('(max-width: 900px)');
  const isCompactHeader = useMediaQuery('(max-width: 1240px)');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('farmora-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleNav = (page) => {
    setActivePage(page);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  if (loading) return null;
  if (!user) return <Login />;
  const Page = pageMap[activePage] || Overview;
  const currentTitle = pageTitleMap[activePage] || 'Farm Overview';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-1)' }}>
      {isMobile && (
        <Sidebar
          active={activePage}
          onNav={handleNav}
          onAiOpen={() => handleNav('farmora-ai')}
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        <div
          className="shell-topbar"
          style={{
            position: isMobile ? 'fixed' : 'sticky',
            top: 0,
            left: isMobile ? 0 : 'auto',
            right: isMobile ? 0 : 'auto',
            zIndex: 50,
            padding: isMobile ? '10px 14px' : '14px 30px',
            display: isMobile ? 'flex' : 'grid',
            gridTemplateColumns: isMobile ? undefined : 'minmax(0, 1fr) auto',
            justifyContent: isMobile ? 'space-between' : 'normal',
            alignItems: 'center',
            gap: 12,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            background: isMobile ? 'var(--panel-bg)' : 'transparent',
            boxShadow: isMobile ? '0 8px 24px rgba(15,23,42,0.12)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, justifyContent: isMobile ? 'flex-start' : 'center' }}>
            {isMobile ? (
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                style={{
                  borderRadius: 10,
                  width: 'auto',
                  padding: '0 12px',
                  height: 34,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
                className="ghost-btn"
                aria-label="Toggle navigation"
              >
                Menu
              </button>
            ) : (
              <div className="top-nav-shell" role="tablist" aria-label="Primary navigation">
                {topNavItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={`top-nav-pill ${activePage === id ? 'active' : ''}`}
                    onClick={() => handleNav(id)}
                    role="tab"
                    aria-selected={activePage === id}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isMobile && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '52vw',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: 13,
                color: 'var(--text-soft)',
                letterSpacing: '0.01em',
                pointerEvents: 'none',
              }}
            >
              <span style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{currentTitle}</span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginLeft: isMobile ? 'auto' : 0,
              justifySelf: isMobile ? 'auto' : 'end',
            }}
          >
            {!isMobile && !isCompactHeader && (
              <>
                <button type="button" className="top-icon-btn" aria-label="Search">
                  <Search size={15} />
                </button>
                <button type="button" className="top-icon-btn" aria-label="Messages">
                  <Mail size={15} />
                </button>
                <button type="button" className="top-icon-btn" aria-label="Notifications">
                  <Bell size={15} />
                </button>
              </>
            )}

            <button
              type="button"
              className="ghost-btn"
              onClick={() => setDarkMode((prev) => !prev)}
              style={{ height: 30, padding: '0 12px', borderRadius: 999, cursor: 'pointer' }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? 'Dark' : 'Light'} {darkMode ? '☾' : '☀'}
            </button>

            {!isMobile && (
              <button type="button" className="top-avatar-chip" aria-label="User menu">
                <span className="avatar-dot">T</span>
                <ChevronDown size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="animate-fade-in" key={activePage} style={{ marginTop: isMobile ? 54 : 0 }}>
          {activePage === 'farmora-ai' ? (
            <FarmoraAIPage onBack={() => handleNav('overview')} />
          ) : (
            <Page onNav={handleNav} />
          )}
        </div>
      </main>


    </div>
  );
}


