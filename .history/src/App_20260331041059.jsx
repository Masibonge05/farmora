import { useState, useContext, useEffect } from 'react';
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

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('farmora-theme') === 'dark');
  const { user, loading } = useContext(AuthContext);
  const isMobile = useMediaQuery('(max-width: 900px)');

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-1)' }}>
      <Sidebar
        active={activePage}
        onNav={handleNav}
        onAiOpen={() => handleNav('farmora-ai')}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        <div
          className="shell-topbar"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            padding: isMobile ? '10px 14px' : '14px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {isMobile && (
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
            )}
            <div style={{ fontSize: 12, color: 'var(--text-soft)', letterSpacing: '0.01em' }}>
            <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>Thabo Farm</span> - Gauteng, South Africa
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16, marginLeft: 'auto' }}>
            <div
              className="mini-pill"
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              <span className="status-dot status-ok"></span>
              Live - 7/7 sensors active
            </div>
            {!isMobile && <div className="mini-pill">24C - Limpopo</div>}
            <button
              type="button"
              className="ghost-btn"
              onClick={() => setDarkMode((prev) => !prev)}
              style={{ height: 30, padding: '0 12px', borderRadius: 999, cursor: 'pointer' }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? 'Dark mode' : 'Light mode'} {darkMode ? '☾' : '☀'}
            </button>
            <div style={{ 
              width: 30, height: 30, borderRadius: '50%',
              background: 'var(--control-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, color: 'var(--control-text)', cursor: 'pointer',
              boxShadow: '0 6px 14px rgba(15,23,42,0.12)'
            }}>T</div>
          </div>
        </div>

        <div className="animate-fade-in" key={activePage}>
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


