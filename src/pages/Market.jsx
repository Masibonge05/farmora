import { marketPrices } from '../data/dummyData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const buyers = [
  { id: 1, name: 'FreshMart Johannesburg', type: 'Retailer', crops: ['Maize', 'Spinach'], rating: 4.8, distance: '120km', verified: true, priceOffer: 'R4,350/ton' },
  { id: 2, name: 'Agri Export SA', type: 'Exporter', crops: ['Maize', 'Sorghum'], rating: 4.6, distance: '85km', verified: true, priceOffer: 'R4,100/ton' },
  { id: 3, name: 'Community Co-op Limpopo', type: 'Co-operative', crops: ['Tomatoes', 'Spinach'], rating: 4.9, distance: '32km', verified: true, priceOffer: 'R12,200/ton' },
  { id: 4, name: 'Spar Distribution Centre', type: 'Retail Chain', crops: ['Tomatoes'], rating: 4.4, distance: '210km', verified: true, priceOffer: 'R13,000/ton' },
];

const priceHistory = [
  { week: 'W1', maize: 3900, tomatoes: 11200, spinach: 7800, sorghum: 2900 },
  { week: 'W2', maize: 4050, tomatoes: 11800, spinach: 8100, sorghum: 3000 },
  { week: 'W3', maize: 4120, tomatoes: 12100, spinach: 8400, sorghum: 3050 },
  { week: 'W4', maize: 4280, tomatoes: 12500, spinach: 8900, sorghum: 3100 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'rgba(15,26,15,0.95)', border: '1px solid rgba(74,158,74,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
        <div style={{ color: '#7ec87e', fontWeight: 700, marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, display: 'flex', gap: 8, marginBottom: 2 }}>
            <span>{p.name}:</span><span style={{ fontWeight: 700 }}>R{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Market() {
  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#f0f4f0', margin: 0, marginBottom: 6 }}>
              🛒 Market & Trade Hub
            </h1>
            <div style={{ fontSize: 14, color: '#8a9e8a' }}>Live commodity prices · Verified buyers · QR traceability</div>
          </div>
          <button style={{ 
            background: 'linear-gradient(135deg, #2d6a2d, #4a9e4a)', 
            color: '#f0f4f0', border: 'none', borderRadius: 10, 
            padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            + List Produce
          </button>
        </div>
      </div>

      {/* Live prices */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {marketPrices.map(m => (
          <div key={m.crop} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#8a9e8a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.crop}</div>
              <span className="status-dot status-ok"></span>
            </div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#f0f4f0', lineHeight: 1 }}>{m.price}</div>
            <div style={{ fontSize: 12, color: '#8a9e8a', marginTop: 2, marginBottom: 10 }}>{m.unit}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 13, fontWeight: 700, color: m.trend === 'up' ? '#7ec87e' : '#f08060'
              }}>
                {m.trend === 'up' ? '↑' : '↓'} {m.change}
              </div>
              <div style={{ fontSize: 11, color: '#4a9e4a' }}>👤 {m.buyers} buyers</div>
            </div>
          </div>
        ))}
      </div>

      {/* Price chart + buyers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Price trends */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 4 }}>
            4-Week Price Trends
          </div>
          <div style={{ fontSize: 12, color: '#8a9e8a', marginBottom: 16 }}>Rand per ton · All crops</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priceHistory} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="maize" name="Maize" fill="#7ec87e" radius={[3,3,0,0]} />
              <Bar dataKey="tomatoes" name="Tomatoes" fill="#e8a020" radius={[3,3,0,0]} />
              <Bar dataKey="spinach" name="Spinach" fill="#80c0f0" radius={[3,3,0,0]} />
              <Bar dataKey="sorghum" name="Sorghum" fill="#a080e0" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* QR Traceability */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 4 }}>
            QR Traceability
          </div>
          <div style={{ fontSize: 12, color: '#8a9e8a', marginBottom: 20 }}>Prove quality to premium buyers</div>
          
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            {/* Fake QR grid */}
            <div style={{ display: 'inline-block', padding: 14, background: 'white', borderRadius: 12 }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                {[...Array(10)].map((_, row) => [...Array(10)].map((_, col) => {
                  const on = Math.random() > 0.45 || (row < 3 && col < 3) || (row < 3 && col > 6) || (row > 6 && col < 3);
                  return on ? <rect key={`${row}-${col}`} x={col*10} y={row*10} width={9} height={9} fill="#1e3a1e" rx={1} /> : null;
                }))}
              </svg>
            </div>
            <div style={{ fontSize: 11, color: '#4a9e4a', marginTop: 8, fontWeight: 600 }}>FM-A-2026-0330-MAIZE</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Field', val: 'Field A · North Plot' },
              { label: 'Harvest Date', val: '12 April 2026 (est.)' },
              { label: 'Pesticide-free', val: '✓ 28 days clear' },
              { label: 'Moisture at harvest', val: '14.2%' },
              { label: 'Certifications', val: 'GAP Compliant' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(74,158,74,0.1)', fontSize: 12 }}>
                <span style={{ color: '#8a9e8a' }}>{r.label}</span>
                <span style={{ color: '#f0f4f0', fontWeight: 600 }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verified buyers */}
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 14 }}>
          Verified Buyers
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {buyers.map(buyer => (
            <div key={buyer.id} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#f0f4f0' }}>{buyer.name}</div>
                  {buyer.verified && <span style={{ fontSize: 14 }}>✅</span>}
                </div>
                <div style={{ fontSize: 11, color: '#8a9e8a', marginBottom: 6 }}>{buyer.type} · {buyer.distance}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                  {buyer.crops.map(c => <span key={c} className="chip chip-green">{c}</span>)}
                </div>
                <div style={{ fontSize: 12, color: '#e8a020', fontWeight: 600 }}>Offering: {buyer.priceOffer}</div>
              </div>
              <div style={{ textAlign: 'right', marginLeft: 16 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#7ec87e' }}>{buyer.rating}</div>
                <div style={{ fontSize: 10, color: '#8a9e8a' }}>Rating</div>
                <button style={{ marginTop: 10, background: 'rgba(74,158,74,0.2)', border: '1px solid rgba(74,158,74,0.4)', color: '#7ec87e', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
