import { useState } from 'react';
import QRCode from 'qrcode.react';
import { marketPrices } from '../data/dummyData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useMediaQuery from '../lib/useMediaQuery';
import { X, CheckCircle2, Award, Leaf, Droplets } from 'lucide-react';

// ── Farmer Products Data ──────────────────────────────────────────
const farmerProducts = {
  'FM-A-2026-0330-MAIZE': {
    farmName: 'Thabo\'s Precision Farm',
    farmerId: 'FARM-THA-001',
    field: 'Field A - North Plot (4.2 ha)',
    crops: [
      { 
        name: 'Maize (ZA White)', 
        quantity: '8.4 tons available', 
        category: 'Cereals',
        price: 'R4,280/ton',
        harvestDate: '12 April 2026',
        moisture: '14.2%',
        quality: 'Grade A',
        yield: '2.0 tons/ha',
        certification: 'GAP Compliant'
      },
      { 
        name: 'Sorghum', 
        quantity: '3.1 tons available',
        category: 'Cereals',
        price: 'R3,100/ton',
        harvestDate: '15 May 2026',
        moisture: '13.8%',
        quality: 'Grade A',
        yield: '1.0 tons/ha',
        certification: 'GAP Compliant'
      },
    ],
    certifications: ['GAP Compliant', 'Pesticide-free (28 days)', 'Soil Health Certified'],
    farmRating: 4.8,
    reviews: 127,
    location: 'Gauteng Province, South Africa',
    soilHealth: 'Excellent',
    waterUsage: 'Optimized - AI monitored',
    lastAudit: '15 March 2026',
    contactFarmer: '+27 123 456 789',
  }
};

const buyers = [
  { id: 1, name: 'FreshMart Johannesburg',    type: 'Retailer',     crops: ['Maize', 'Spinach'],    rating: 4.8, distance: '120km', verified: true, priceOffer: 'R4,350/ton' },
  { id: 2, name: 'Agri Export SA',            type: 'Exporter',     crops: ['Maize', 'Sorghum'],    rating: 4.6, distance: '85km',  verified: true, priceOffer: 'R4,100/ton' },
  { id: 3, name: 'Community Co-op Gauteng',   type: 'Co-operative', crops: ['Tomatoes', 'Spinach'], rating: 4.9, distance: '32km',  verified: true, priceOffer: 'R12,200/ton' },
  { id: 4, name: 'Spar Distribution Centre',  type: 'Retail Chain', crops: ['Tomatoes'],            rating: 4.4, distance: '210km', verified: true, priceOffer: 'R13,000/ton' },
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
      <div style={{ background: '#ffffff', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: '0 10px 24px rgba(15,23,42,0.12)' }}>
        <div style={{ color: '#475569', fontWeight: 700, marginBottom: 6 }}>{label}</div>
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
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');
  
  const handleQRClick = (qrCode) => {
    setSelectedQRCode(qrCode);
  };
  
  const closeModal = () => {
    setSelectedQRCode(null);
  };

  return (
    <div style={{ padding: isMobile ? '18px 14px' : '28px 32px', width: '100%' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-strong)', margin: 0, marginBottom: 6 }}>
               Market & Trade Hub
            </h1>
            <div style={{ fontSize: 14, color: 'var(--text-soft)' }}>Live commodity prices - Verified buyers - QR traceability</div>
          </div>
          <button style={{ 
            background: 'linear-gradient(135deg, #475569, #64748b)', 
            color: 'var(--text-strong)', border: 'none', borderRadius: 10, 
            padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Manrope, sans-serif'
          }}>
            + List Produce
          </button>
        </div>
      </div>

      {/* Live prices */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {marketPrices.map(m => (
          <div key={m.crop} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-soft)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.crop}</div>
              <span className="status-dot status-ok"></span>
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-strong)', lineHeight: 1 }}>{m.price}</div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2, marginBottom: 10 }}>{m.unit}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 13, fontWeight: 700, color: m.trend === 'up' ? '#475569' : '#334155'
              }}>
                {m.trend === 'up' ? '+' : '-'} {m.change}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)' }}>{m.buyers} buyers</div>
            </div>
          </div>
        ))}
      </div>

      {/* Price chart + buyers */}
      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1.2fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Price trends */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 4 }}>
            4-Week Price Trends
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 16 }}>Rand per ton - All crops</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priceHistory} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="maize" name="Maize" fill="#475569" radius={[3,3,0,0]} />
              <Bar dataKey="tomatoes" name="Tomatoes" fill="#64748b" radius={[3,3,0,0]} />
              <Bar dataKey="spinach" name="Spinach" fill="#8fbda8" radius={[3,3,0,0]} />
              <Bar dataKey="sorghum" name="Sorghum" fill="#a080e0" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* QR Traceability */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 4 }}>
            QR Traceability
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 20 }}>Scan or click to verify farmer produce</div>
          
          <div style={{ textAlign: 'center', marginBottom: 20, cursor: 'pointer' }} onClick={() => handleQRClick('FM-A-2026-0330-MAIZE')}>
            {/* Real Scannable QR Code */}
            <div style={{ display: 'inline-block', padding: 14, background: 'white', borderRadius: 12, border: '2px solid rgba(34,197,94,0.3)', transition: 'all 0.2s' }}>
              <QRCode 
                value="https://farmora.app/verify?id=FM-A-2026-0330-MAIZE&farmer=FARM-THA-001&farm=Thabos-Precision-Farm"
                size={120}
                level="H"
                includeMargin={true}
                fgColor="#1f2937"
                bgColor="#ffffff"
              />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 8, fontWeight: 600 }}>FM-A-2026-0330-MAIZE</div>
            <div style={{ fontSize: 10, color: '#22c55e', marginTop: 4, fontWeight: 600, cursor: 'pointer' }}>Scan or tap to view farmer produce →</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Field', val: 'Field A - North Plot' },
              { label: 'Harvest Date', val: '12 April 2026 (est.)' },
              { label: 'Pesticide-free', val: '28 days clear' },
              { label: 'Moisture at harvest', val: '14.2%' },
              { label: 'Certifications', val: 'GAP Compliant' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', boxShadow: 'inset 0 -1px rgba(100,116,139,0.12)', fontSize: 12 }}>
                <span style={{ color: 'var(--text-soft)' }}>{r.label}</span>
                <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Details Modal */}
      {selectedQRCode && farmerProducts[selectedQRCode] && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--panel-bg)', borderRadius: 16, boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 24px 16px', borderBottom: '1px solid rgba(100,116,139,0.12)' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Trusted Farmer Profile</div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-strong)', margin: 0 }}>
                  {farmerProducts[selectedQRCode].farmName}
                </h2>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', color: 'var(--text-soft)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Farm Info */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Award size={18} color="#22c55e" />
                  <span style={{ fontWeight: 700, color: 'var(--text-strong)' }}>Farm Credentials</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 12 }}>
                  {[
                    { label: 'Farmer ID', val: farmerProducts[selectedQRCode].farmerId },
                    { label: 'Farm Location', val: farmerProducts[selectedQRCode].location },
                    { label: 'Rating', val: `${farmerProducts[selectedQRCode].farmRating}★ (${farmerProducts[selectedQRCode].reviews} reviews)` },
                    { label: 'Last Audit', val: farmerProducts[selectedQRCode].lastAudit },
                    { label: 'Soil Health', val: farmerProducts[selectedQRCode].soilHealth },
                    { label: 'Water Management', val: farmerProducts[selectedQRCode].waterUsage },
                  ].map(item => (
                    <div key={item.label} style={{ padding: '12px', background: 'rgba(34,197,94,0.06)', borderRadius: 8, border: '1px solid rgba(34,197,94,0.2)' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-soft)', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-strong)', fontWeight: 700 }}>{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <CheckCircle2 size={18} color="#22c55e" />
                  <span style={{ fontWeight: 700, color: 'var(--text-strong)' }}>Certifications & Standards</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {farmerProducts[selectedQRCode].certifications.map(cert => (
                    <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(34,197,94,0.08)', borderRadius: 8, borderLeft: '3px solid #22c55e' }}>
                      <CheckCircle2 size={16} color="#22c55e" />
                      <span style={{ fontSize: 13, color: 'var(--text-strong)', fontWeight: 600 }}>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Produce */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Leaf size={18} color="#22c55e" />
                  <span style={{ fontWeight: 700, color: 'var(--text-strong)' }}>Available Produce</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {farmerProducts[selectedQRCode].crops.map((crop, idx) => (
                    <div key={idx} style={{ padding: '14px', background: 'var(--surface-muted)', borderRadius: 10, border: '1px solid rgba(100,116,139,0.12)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>{crop.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>{crop.category}</div>
                        </div>
                        <span style={{ background: '#22c55e', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Available</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, paddingTop: 10, borderTop: '1px solid rgba(100,116,139,0.12)' }}>
                        {[
                          { icon: '📦', label: 'Quantity', val: crop.quantity },
                          { icon: '💰', label: 'Price', val: crop.price },
                          { icon: '📅', label: 'Harvest', val: crop.harvestDate },
                        ].map(item => (
                          <div key={item.label}>
                            <div style={{ fontSize: 16, marginBottom: 4 }}>{item.icon}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-soft)', marginBottom: 2 }}>{item.label}</div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-strong)' }}>{item.val}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(100,116,139,0.12)' }}>
                        {[
                          { icon: '🌾', label: 'Quality', val: crop.quality },
                          { icon: '💧', label: 'Moisture', val: crop.moisture },
                          { icon: '📊', label: 'Yield', val: crop.yield },
                        ].map(item => (
                          <div key={item.label}>
                            <div style={{ fontSize: 16, marginBottom: 4 }}>{item.icon}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-soft)', marginBottom: 2 }}>{item.label}</div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-strong)' }}>{item.val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div style={{ padding: '14px', background: 'rgba(34,197,94,0.08)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-soft)', fontWeight: 600, marginBottom: 6 }}>Contact Farmer Directly</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>{farmerProducts[selectedQRCode].contactFarmer}</div>
                <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 4 }}>Negotiate bulk orders • Request samples • Custom requests</div>
              </div>

              {/* Action button */}
              <button onClick={closeModal} style={{ width: '100%', marginTop: 16, padding: '12px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                ✓ Verified Farmer — Ready to Trade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verified buyers */}
      <div>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)', marginBottom: 14 }}>
          Verified Buyers
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : 'repeat(2, 1fr)', gap: 14 }}>
          {buyers.map(buyer => (
            <div key={buyer.id} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-strong)' }}>{buyer.name}</div>
                  {buyer.verified && <span style={{ fontSize: 12, color: 'var(--text-soft)', fontWeight: 700 }}>VER</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 4 }}>{buyer.type}</div>
                <div style={{ fontSize: 11, color: 'var(--text-soft)' }}>{buyer.crops.join(', ')}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12 }}>
                <div style={{ color: 'var(--text-strong)', fontWeight: 700, marginBottom: 4 }}>{buyer.rating}★</div>
                <div style={{ color: 'var(--text-soft)', fontSize: 11, marginBottom: 4 }}>{buyer.distance}</div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#7ec87e', fontSize: 11 }}>{buyer.priceOffer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



