import { useState, useContext } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import CropHealth from './pages/CropHealth';
import SoilWater from './pages/SoilWater';
import Market from './pages/Market';
import Sensors from './pages/Sensors';
import Alerts from './pages/Alerts';
import AuthContext from './contexts/AuthContext';
import Login from './components/Login';

const pageMap = {
  overview: Overview,
  'crop-health': CropHealth,
  soil: SoilWater,
  market: Market,
  sensors: Sensors,
  alerts: Alerts,
};

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  if (!user) return <Login />;
  const Page = pageMap[activePage] || Overview;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b150b' }}>
      <div style={{ 
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 60% 40% at 70% 20%, rgba(45,106,45,0.06) 0%, transparent 70%)'
      }} />
      
      <Sidebar active={activePage} onNav={setActivePage} />

      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(11,21,11,0.9)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(74,158,74,0.1)',
          padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ fontSize: 13, color: '#8a9e8a' }}>
            <span style={{ color: '#4a9e4a' }}>Thabo Farm</span> · Limpopo, South Africa
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4a9e4a' }}>
              <span className="status-dot status-ok"></span>
              Live · 7/7 sensors active
            </div>
            <div style={{ fontSize: 13, color: '#8a9e8a' }}>⛅ 24°C · Limpopo</div>
            <div style={{ 
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2d6a2d, #7ec87e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#0b150b', cursor: 'pointer'
            }}>T</div>
          </div>
        </div>

        <div className="animate-fade-in" key={activePage}>
          <Page />
        </div>
      </main>
    </div>
  );
}
