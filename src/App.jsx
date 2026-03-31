import { useState, useContext, useEffect, useRef } from 'react';
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
import CropFieldDetail from './pages/CropFieldDetail';
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
  'crop-field-detail': 'Field Details',
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

const THEME_STORAGE_KEY = 'farmora-theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'dark') return true;
  if (savedTheme === 'light') return false;

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [selectedFieldId, setSelectedFieldId] = useState('field-a');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(getInitialTheme);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileMenuError, setProfileMenuError] = useState('');
  const [navIndicator, setNavIndicator] = useState({ left: 0, width: 0, visible: false });

  const profileMenuRef = useRef(null);
  const navShellRef = useRef(null);
  const navButtonRefs = useRef({});

  const { user, loading, signOut } = useContext(AuthContext);
  const isMobile = useMediaQuery('(max-width: 900px)');
  const isCompactHeader = useMediaQuery('(max-width: 1240px)');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
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
    if (isMobile || activePage === 'crop-field-detail') {
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
      setNavIndicator({ left: 0, width: 0, visible: false });
    };
  }, [activePage, isMobile, isCompactHeader]);

  const handleNav = (page) => {
    setActivePage(page);
    if (isMobile) setSidebarOpen(false);
    setProfileMenuOpen(false);
    setProfileMenuError('');
  };

  const openField = (fieldId) => {
    setSelectedFieldId(fieldId);
    setActivePage('crop-field-detail');
    if (isMobile) setSidebarOpen(false);
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

    if (nextName === null) return;

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

  if (loading) return null;
  if (!user) return <Login />;

  const Page = pageMap[activePage] || Overview;
  const currentTitle = pageTitleMap[activePage] || 'Farm Overview';
  const avatarLabel = (user?.displayName || user?.email || 'User').trim();
  const avatarLetter = avatarLabel.charAt(0).toUpperCase();

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
          userName={user?.displayName || 'Farmora User'}
          userEmail={user?.email || 'No email'}
          avatarLetter={avatarLetter}
          onSignOut={handleSignOut}
        />
      )}

      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, marginTop: '58px' }}>
        <div
          className="shell-topbar"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
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
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              minWidth: 0,
              justifyContent: isMobile ? 'flex-start' : 'center',
            }}
          >
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
              <div className="top-nav-shell" role="tablist" aria-label="Primary navigation" ref={navShellRef}>
                <span
                  className="top-nav-indicator"
                  style={{
                    width: navIndicator.width,
                    transform: `translateX(${navIndicator.left}px)`,
                    opacity: navIndicator.visible ? 1 : 0,
                  }}
                />
                {topNavItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    ref={(el) => {
                      if (el) navButtonRefs.current[id] = el;
                    }}
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
              {darkMode ? 'Switch to Light' : 'Switch to Dark'} {darkMode ? '☀' : '☾'}
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
                  <ChevronDown
                    size={14}
                    style={{
                      transform: profileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
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
                  <div
                    style={{
                      padding: '6px 8px 10px',
                      borderBottom: '1px solid rgba(148,163,184,0.2)',
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--text-strong)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user?.displayName || 'Farmora User'}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--text-soft)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
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

        <div className="animate-fade-in" key={`${activePage}-${selectedFieldId}`} style={{ marginTop: 0 }}>
          {activePage === 'farmora-ai' ? (
            <FarmoraAIPage onBack={() => handleNav('overview')} />
          ) : activePage === 'crop-field-detail' ? (
            <CropFieldDetail
              fieldId={selectedFieldId}
              onBack={() => handleNav('crop-health')}
            />
          ) : (
            <Page onNav={handleNav} onOpenField={openField} />
          )}
        </div>
      </main>
    </div>
  );
}