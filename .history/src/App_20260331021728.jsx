import { useState, useContext } from 'react';
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
  const { user, loading } = useContext(AuthContext);
  const isMobile = useMediaQuery('(max-width: 900px)');

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b150b' }}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(ellipse 60% 40% at 70% 20%, rgba(45,106,45,0.06) 0%, transparent 70%)',
        }}
      />

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
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(11,21,11,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(74,158,74,0.1)',
            padding: isMobile ? '10px 14px' : '12px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {isMobile && (
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                style={{
                  border: '1px solid rgba(74,158,74,0.3)',
                  background: 'rgba(74,158,74,0.1)',
                  color: '#7ec87e',
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  fontSize: 18,
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
                aria-label="Toggle navigation"
              >
                ☰
              </button>
            )}
            <div style={{ fontSize: 13, color: '#8a9e8a' }}>
            <span style={{ color: '#4a9e4a' }}>Thabo Farm</span> · Gauteng, South Africa
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16, marginLeft: 'auto' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: '#4a9e4a',
                whiteSpace: 'nowrap',
              }}
            >
              <span className="status-dot status-ok"></span>
              Live · 7/7 sensors active
            </div>
            {!isMobile && <div style={{ fontSize: 13, color: '#8a9e8a' }}>⛅ 24°C · Limpopo</div>}
            <div style={{ 
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2d6a2d, #7ec87e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#0b150b', cursor: 'pointer'
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