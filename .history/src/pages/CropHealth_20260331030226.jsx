import { farmFields, diseaseScans } from '../data/dummyData';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import useMediaQuery from '../lib/useMediaQuery';

const radarData = [
  { metric: 'Leaf Health', A: 88, B: 54, C: 92, D: 41 },
  { metric: 'Root Vigour', A: 82, B: 70, C: 85, D: 35 },
  { metric: 'Moisture', A: 68, B: 42, C: 74, D: 28 },
  { metric: 'Nutrients', A: 79, B: 66, C: 80, D: 55 },
  { metric: 'Pest Risk', A: 92, B: 60, C: 95, D: 40 },
  { metric: 'Yield Est.', A: 85, B: 58, C: 88, D: 38 },
];

const ndviColors = (v) => v > 0.75 ? '#b8924a' : v > 0.55 ? '#e8a020' : '#c85820';

export default function CropHealth() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');

  return (
    <div style={{ padding: isMobile ? '18px 14px' : '28px 32px', maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#1f2937', margin: 0, marginBottom: 6 }}>
           Crop Health Monitor
        </h1>
        <div style={{ fontSize: 14, color: '#6b7280' }}>AI-powered NDVI analysis & disease detection across all fields</div>
      </div>

      {/* NDVI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {farmFields.map(field => {
          const col = ndviColors(field.ndvi);
          return (
            <div key={field.id} className="card" style={{ padding: '20px', textAlign: 'center' }}>
              {/* Visual NDVI circle */}
              <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 14px' }}>
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle cx="45" cy="45" r="38" fill="none" stroke={col} strokeWidth="8"
                    strokeDasharray={`${field.ndvi * 238.76} 238.76`}
                    strokeLinecap="round"
                    transform="rotate(-90 45 45)"
                    style={{ filter: `drop-shadow(0 0 6px ${col}80)` }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: col, lineHeight: 1 }}>
                    {(field.ndvi * 100).toFixed(0)}
                  </div>
                  <div style={{ fontSize: 9, color: '#6b7280' }}>NDVI</div>
                </div>
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13, color: '#1f2937' }}>{field.crop}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{field.name.split('')[0].trim()}</div>
              <div style={{ marginTop: 8 }}>
                <span className={`chip ${field.status === 'healthy' ? 'chip-green' : field.status === 'warning' ? 'chip-amber' : 'chip-red'}`}>
                  {field.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Radar + Disease scans */}
      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Radar chart */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1f2937', marginBottom: 4 }}>
            Multi-Parameter Health Radar
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>Comparing Field A vs Field B vs Field C</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <Radar name="Field A" dataKey="A" stroke="#b8924a" fill="#b8924a" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Field B" dataKey="B" stroke="#e8a020" fill="#e8a020" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Field C" dataKey="C" stroke="#80c0f0" fill="#80c0f0" fillOpacity={0.1} strokeWidth={2} />
              <Tooltip contentStyle={{ background: 'rgba(15,26,15,0.95)', border: '1px solid rgba(184,146,74,0.3)', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 4 }}>
            {[['Field A', '#b8924a'], ['Field B', '#e8a020'], ['Field C', '#80c0f0']].map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Disease detection */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1f2937', marginBottom: 4 }}>
            AI Disease Detection
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>Vision model scan results - Last updated 1h ago</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {diseaseScans.map((scan, i) => {
              const isClear = scan.severity === 'Clear';
              const sevColor = scan.severity === 'High' ? '#c85820' : scan.severity === 'Moderate' ? '#e8a020' : '#b8924a';
              return (
                <div key={i} style={{ 
                  padding: '14px 16px', borderRadius: 12,
                  background: isClear ? 'rgba(184,146,74,0.05)' : 'rgba(200,88,32,0.06)',
                  border: `1px solid ${isClear ? 'rgba(184,146,74,0.15)' : 'rgba(200,88,32,0.2)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#1f2937' }}>{scan.field}</div>
                      <div style={{ fontSize: 12, color: sevColor, fontWeight: 600, marginTop: 2 }}>{scan.disease}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>Confidence</div>
                      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18, color: sevColor }}>{scan.confidence}%</div>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: 11, color: '#6b7280', 
                    background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '6px 10px',
                    borderLeft: `2px solid ${sevColor}`
                  }}>
                    <strong style={{ color: sevColor }}>Action: </strong>{scan.action}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick recommendations */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1f2937', marginBottom: 16 }}>
           AI Recommendations
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: 'RX', title: 'Apply Fungicide', field: 'Field B - Urgent', desc: 'Mancozeb 80WP recommended. Apply within 48 hours to prevent spread of leaf spot.', type: 'alert' },
            { icon: 'IR', title: 'Emergency Irrigation', field: 'Field D - Critical', desc: 'Soil moisture at 28%. Run drip irrigation for 4 hours at 6L/hr. Check drainage first.', type: 'alert' },
            { icon: 'HV', title: 'Harvest Window', field: 'Field A - Opportunity', desc: 'Maize approaches optimal brix in 12 days. Pre-book market at current R4,280/ton.', type: 'info' },
          ].map(r => (
            <div key={r.title} style={{ 
              padding: '14px 16px', borderRadius: 12,
              background: r.type === 'alert' ? 'rgba(200,88,32,0.08)' : 'rgba(58,140,200,0.08)',
              border: `1px solid ${r.type === 'alert' ? 'rgba(200,88,32,0.25)' : 'rgba(58,140,200,0.25)'}`,
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{r.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1f2937', marginBottom: 2 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: '#e8a020', fontWeight: 600, marginBottom: 6 }}>{r.field}</div>
              <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



