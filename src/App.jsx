import { useState, useEffect, useContext } from 'react';
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
import { fetchWeather } from './services/weatherService';

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

// ── Splash ──────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: '#080f08',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      animation: 'splash-out 0.5s ease 2.1s forwards',
    }}>
      <style>{`
        @keyframes splash-ring {
          0%   { transform: scale(0.7); opacity: 0;    }
          50%  { opacity: 0.14; }
          100% { transform: scale(1.9); opacity: 0;    }
        }
        @keyframes splash-in {
          from { opacity: 0; transform: scale(0.88) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes splash-out {
          from { opacity: 1; }
          to   { opacity: 0; pointer-events: none; }
        }
        @keyframes splash-bar {
          from { width: 0;    }
          to   { width: 100%; }
        }
      `}</style>

      <div style={{ position: 'absolute', width: 220, height: 220 }}>
        {[0, 0.5, 1].map(d => (
          <div key={d} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1px solid rgba(74,158,74,0.35)',
            animation: `splash-ring 2s ease ${d}s infinite`,
          }} />
        ))}
      </div>

      <img
        src="/farmora-logo.png"
        alt="Farmora"
        style={{
          width: 165, position: 'relative', zIndex: 1,
          animation: 'splash-in 0.7s ease 0.2s both',
          filter: 'drop-shadow(0 0 28px rgba(74,158,74,0.45))',
        }}
      />

      <div style={{
        width: 140, height: 2, borderRadius: 2, overflow: 'hidden',
        background: 'rgba(74,158,74,0.15)',
        position: 'relative', zIndex: 1,
        animation: 'splash-in 0.5s ease 0.8s both',
      }}>
        <div style={{
          height: '100%', background: 'linear-gradient(90deg, #2d6a2d, #7ec87e)',
          borderRadius: 2, width: 0,
          animation: 'splash-bar 1.6s ease 0.9s forwards',
        }} />
      </div>
    </div>
  );
}

// ── App ─────────────────────────────────────────────────────────
export default function App() {
  // ✅ ALL hooks must be declared first — before any early returns
  const [activePage, setActivePage]     = useState('overview');
  const [showSplash, setShowSplash]     = useState(true);
  const [isDark, setIsDark]             = useState(true);
  const [topbarWeather, setTopbarWeather] = useState(null);
  const { user, loading }               = useContext(AuthContext);

  useEffect(() => {
    fetchWeather().then(w => setTopbarWeather(w.current)).catch(() => {});
  }, []);

  useEffect(() => {
    const id = 'farmora-light-theme';
    let el = document.getElementById(id);
    if (!isDark) {
      if (!el) {
        el = document.createElement('style');
        el.id = id;
        document.head.appendChild(el);
      }
      el.textContent = `
        body { background-color: #edf6ed !important; color: #1a2e1a !important; }
        .card {
          background: linear-gradient(135deg,rgba(255,255,255,0.95) 0%,rgba(235,248,235,0.97) 100%) !important;
          border-color: rgba(45,106,45,0.14) !important;
          box-shadow: 0 1px 8px rgba(45,106,45,0.06) !important;
        }
        .card:hover {
          border-color: rgba(45,106,45,0.30) !important;
          box-shadow: 0 4px 24px rgba(45,106,45,0.09) !important;
        }
        .nav-item        { color: #3a5e3a !important; }
        .nav-item:hover  { background: rgba(45,106,45,0.09) !important; color: #2d6a2d !important; }
        .nav-item.active { background: rgba(45,106,45,0.13) !important; color: #1e5a1e !important; border-left-color: #2d6a2d !important; }
        ::-webkit-scrollbar-track { background: #edf6ed !important; }
        ::-webkit-scrollbar-thumb { background: #90bc90 !important; }
      `;
    } else if (el) {
      el.remove();
    }
  }, [isDark]);

  // ✅ Early returns AFTER all hooks
  if (loading) return null;
  if (!user)   return <Login />;

  const Page = pageMap[activePage] || Overview;

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <div style={{
        display: 'flex', minHeight: '100vh',
        background: isDark ? '#0b150b' : '#edf6ed',
        transition: 'background 0.3s ease',
      }}>
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 60% 40% at 70% 20%, rgba(45,106,45,0.06) 0%, transparent 70%)',
        }} />

        <Sidebar
          active={activePage}
          onNav={setActivePage}
          onAiOpen={() => setActivePage('farmora-ai')}
          weather={topbarWeather}
        />

        <main style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>

          {/* ── Top bar ── */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: isDark ? 'rgba(11,21,11,0.9)' : 'rgba(237,246,237,0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: isDark ? '1px solid rgba(74,158,74,0.1)' : '1px solid rgba(45,106,45,0.14)',
            padding: '12px 32px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            transition: 'background 0.3s ease',
          }}>
            <div style={{ fontSize: 13, color: isDark ? '#8a9e8a' : '#4a6a4a' }}>
              <span style={{ color: '#4a9e4a', fontWeight: 600 }}>Thabo Farm</span> · Gauteng, South Africa
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4a9e4a' }}>
                <span className="status-dot status-ok" />
                Live · 7/7 sensors active
              </div>

              <div style={{ fontSize: 13, color: isDark ? '#8a9e8a' : '#4a6a4a' }}>
                {topbarWeather
                  ? `${topbarWeather.icon} ${topbarWeather.temp}°C · Gauteng`
                  : '⛅ Loading...'}
              </div>

              {/* ── Dark / Light toggle ── */}
              <button
                onClick={() => setIsDark(d => !d)}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                style={{
                  width: 46, height: 24, borderRadius: 12,
                  border: 'none', cursor: 'pointer', position: 'relative',
                  background: isDark ? 'rgba(74,158,74,0.2)' : 'rgba(45,106,45,0.15)',
                  outline: `1px solid ${isDark ? 'rgba(74,158,74,0.38)' : 'rgba(45,106,45,0.28)'}`,
                  transition: 'background 0.3s',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute', top: 4, left: isDark ? 25 : 4,
                  width: 16, height: 16, borderRadius: '50%',
                  background: isDark ? '#7ec87e' : '#2d6a2d',
                  transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, lineHeight: 1,
                }}>
                  {isDark ? '🌙' : '☀️'}
                </div>
              </button>

              {/* Avatar */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2d6a2d, #7ec87e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
              }}>T</div>
            </div>
          </div>

          {/* ── Page content ── */}
          <div className="animate-fade-in" key={activePage}>
            {activePage === 'farmora-ai' ? (
              <FarmoraAIPage onBack={() => setActivePage('overview')} />
            ) : (
              <Page onNav={setActivePage} weather={topbarWeather} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}