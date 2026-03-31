import { useState, useEffect, useContext, useEffect, useRef } from 'react';
import { updateProfile } from 'firebase/auth';
import {
  House,
  Sprout,
  Droplets,
  TriangleAlert,
  ShoppingCart,
  Wifi,
  CloudRain,
  Rocket,
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
import { fetchWeather } from './services/weatherService';
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
  { id: 'farmora-ai', label: 'Farmora AI', icon: Rocket },
  { id: 'market', label: 'Market', icon: ShoppingCart },
  { id: 'sensors', label: 'Sensors', icon: Wifi },
  { id: 'weather', label: 'Weather', icon: CloudRain },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('farmora-theme') === 'dark');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileMenuError, setProfileMenuError] = useState('');
  const [navIndicator, setNavIndicator] = useState({ left: 0, width: 0, visible: false });
  const profileMenuRef = useRef(null);
  const navShellRef = useRef(null);
  const navButtonRefs = useRef({});
  const isMobile = useMediaQuery('(max-width: 900px)');
  const isCompactHeader = useMediaQuery('(max-width: 1240px)');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('farmora-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (!profileMenuOpen) return;

    const handleOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
        setProfileMenuError('');
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false);
        setProfileMenuError('');
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    if (isMobile) {
      setNavIndicator((prev) => ({ ...prev, visible: false }));
      return;
    }

    const updateIndicator = () => {
      const shell = navShellRef.current;
      const activeBtn = navButtonRefs.current[activePage];
      if (!shell || !activeBtn) return;

      setNavIndicator({
        left: activeBtn.offsetLeft - shell.scrollLeft,
        width: activeBtn.offsetWidth,
        visible: true,
      });
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    const shell = navShellRef.current;
    shell?.addEventListener('scroll', updateIndicator, { passive: true });

    return () => {
      window.removeEventListener('resize', updateIndicator);
      shell?.removeEventListener('scroll', updateIndicator);
    };
  }, [activePage, isMobile, isCompactHeader]);

  const handleNav = (page) => {
    setActivePage(page);
    if (isMobile) {
      setSidebarOpen(false);
    }
    setProfileMenuOpen(false);
    setProfileMenuError('');
  };

  const handleSignOut = async () => {
    setProfileMenuError('');
    try {
      await signOut();
      setProfileMenuOpen(false);
    } catch {
      setProfileMenuError('Could not sign out. Please try again.');
    }
  };

  const handleEditProfile = async () => {
    setProfileMenuError('');
    const currentName = user?.displayName || '';
    const nextName = window.prompt('Enter a display name', currentName);

    if (nextName === null) {
      return;
    }

    const cleanName = nextName.trim();
    if (!cleanName) {
      setProfileMenuError('Display name cannot be empty.');
      return;
    }

    try {
      await updateProfile(user, { displayName: cleanName });
      await user.reload();
      setProfileMenuOpen(false);
    } catch {
      setProfileMenuError('Profile update failed. Please try again.');
    }
  };

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
  const currentTitle = pageTitleMap[activePage] || 'Farm Overview';
  const avatarLabel = (user?.displayName || user?.email || 'User').trim();
  const avatarLetter = avatarLabel.charAt(0).toUpperCase();

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

        {!isMobile && (
          <Sidebar
            active={activePage}
            onNav={handleNav}
            onAiOpen={() => handleNav('farmora-ai')}
            isMobile={false}
            userName={user?.displayName || 'Farmora User'}
            userEmail={user?.email || 'No email'}
            avatarLetter={avatarLetter}
            onSignOut={handleSignOut}
          />
        )}

        {isMobile && (
          <Sidebar
            active={activePage}
            onNav={handleNav}
            onAiOpen={() => handleNav('farmora-ai')}
            isMobile={isMobile}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            userName={user?.displayName || 'Farmora User'}
            userEmail={user?.email || 'No email'}
            avatarLetter={avatarLetter}
            onSignOut={handleSignOut}
          />
        )}

        <main style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, marginTop: isMobile ? '58px' : 0 }}>

          {/* ── Top bar ── */}
          <div
            className="shell-topbar"
            style={{
              position: 'fixed',
              top: 0,
              left: isMobile ? 0 : undefined,
              right: 0,
              zIndex: 100,
              padding: isMobile ? '10px 14px' : '14px 30px',
              display: isMobile ? 'flex' : 'grid',
              gridTemplateColumns: isMobile ? undefined : 'minmax(0, 1fr) auto',
              justifyContent: isMobile ? 'space-between' : 'normal',
              alignItems: 'center',
              gap: 12,
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              background: darkMode
                ? 'var(--panel-bg)'
                : 'linear-gradient(180deg, #eef7f2 0%, #e8f3ec 100%)',
              boxShadow: isMobile ? '0 8px 24px rgba(15,23,42,0.12)' : '0 2px 12px rgba(15,23,42,0.08)',
            }}

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
                <div ref={profileMenuRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="top-avatar-chip"
                    aria-label="User menu"
                    aria-expanded={profileMenuOpen}
                    onClick={() => {
                      setProfileMenuError('');
                      setProfileMenuOpen((prev) => !prev);
                    }}
                  >
                    <span className="avatar-dot">{avatarLetter}</span>
                    <ChevronDown size={14} style={{ transform: profileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                  </button>

                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 10px)',
                      width: 220,
                      background: 'var(--panel-bg)',
                      border: '1px solid rgba(148,163,184,0.3)',
                      borderRadius: 12,
                      boxShadow: '0 14px 28px rgba(15,23,42,0.16)',
                      padding: 10,
                      opacity: profileMenuOpen ? 1 : 0,
                      transform: profileMenuOpen ? 'translateY(0)' : 'translateY(-8px)',
                      visibility: profileMenuOpen ? 'visible' : 'hidden',
                      pointerEvents: profileMenuOpen ? 'auto' : 'none',
                      transition: 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease',
                      zIndex: 120,
                    }}
                  >
                    <div style={{ padding: '6px 8px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', marginBottom: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.displayName || 'Farmora User'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.email || 'No email'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleEditProfile}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        border: '1px solid rgba(148,163,184,0.25)',
                        borderRadius: 8,
                        background: 'transparent',
                        color: 'var(--text-strong)',
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '8px 10px',
                        cursor: 'pointer',
                        marginBottom: 8,
                      }}
                    >
                      Edit Profile
                    </button>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        border: '1px solid rgba(239,68,68,0.35)',
                        borderRadius: 8,
                        background: 'transparent',
                        color: '#ef4444',
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '8px 10px',
                        cursor: 'pointer',
                      }}
                    >
                      Sign Out
                    </button>

                    {profileMenuError && (
                      <div style={{ fontSize: 11, color: '#ef4444', marginTop: 8, padding: '0 2px' }}>
                        {profileMenuError}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
