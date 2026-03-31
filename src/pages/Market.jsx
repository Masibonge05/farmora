import { useState } from 'react';
import { marketPrices } from '../data/dummyData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Eye, MessageSquare, TrendingUp, Package, CheckCircle, Clock, X } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────
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

const INITIAL_LISTINGS = [
  {
    id: 1, crop: 'Maize', quantity: 2.8, unit: 'ton', askPrice: 4350,
    field: 'Field A', quality: 'Grade A', status: 'active',
    views: 34, offers: 3, posted: '2 days ago',
    description: 'GAP certified · 14.2% moisture · pesticide-free 28 days',
    bestOffer: { buyer: 'FreshMart Johannesburg', price: 4350, time: '3h ago' },
  },
  {
    id: 2, crop: 'Spinach', quantity: 0.4, unit: 'ton', askPrice: 8900,
    field: 'Field C', quality: 'Grade A', status: 'active',
    views: 18, offers: 2, posted: '1 day ago',
    description: 'Fresh · hand-harvested · ready for immediate pickup',
    bestOffer: { buyer: 'Community Co-op Gauteng', price: 8750, time: '6h ago' },
  },
  {
    id: 3, crop: 'Sorghum', quantity: 1.5, unit: 'ton', askPrice: 3100,
    field: 'Field D', quality: 'Grade B', status: 'paused',
    views: 7, offers: 0, posted: '5 days ago',
    description: 'Moisture deficit — will list remainder after recovery',
    bestOffer: null,
  },
];

const CROPS    = ['Maize', 'Tomatoes', 'Spinach', 'Sorghum'];
const QUALITIES = ['Grade A', 'Grade B', 'Grade C'];
const FIELDS   = ['Field A', 'Field B', 'Field C', 'Field D'];

const statusCfg = {
  active: { color: '#7ec87e', bg: 'rgba(74,158,74,0.1)',  border: 'rgba(74,158,74,0.25)',  label: 'Active'  },
  paused: { color: '#e8a020', bg: 'rgba(232,160,32,0.1)', border: 'rgba(232,160,32,0.25)', label: 'Paused'  },
  sold:   { color: '#80c0f0', bg: 'rgba(58,140,200,0.1)', border: 'rgba(58,140,200,0.25)', label: 'Sold'    },
};

// ── Small helpers ─────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(15,26,15,0.97)', border: '1px solid rgba(74,158,74,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: '#7ec87e', fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', gap: 8, marginBottom: 2 }}>
          <span>{p.name}:</span><span style={{ fontWeight: 700 }}>R{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

function TabBtn({ id, active, onClick, children }) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
        border: active ? '1px solid rgba(74,158,74,0.45)' : '1px solid rgba(74,158,74,0.12)',
        background: active ? 'rgba(74,158,74,0.15)' : 'transparent',
        color: active ? '#7ec87e' : '#8a9e8a',
        transition: 'all 0.18s ease',
      }}
    >
      {children}
    </button>
  );
}

// ── List Produce Modal ─────────────────────────────────────────────
function ListingModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ crop: 'Maize', quantity: '', unit: 'ton', askPrice: '', field: 'Field A', quality: 'Grade A', description: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.quantity && form.askPrice;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(22,42,22,0.99), rgba(10,18,10,0.99))',
        border: '1px solid rgba(74,158,74,0.3)', borderRadius: 20,
        padding: '28px 32px', width: 480, maxWidth: '94vw',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        animation: 'slide-in 0.25s ease forwards',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#f0f4f0' }}>List Produce</div>
            <div style={{ fontSize: 12, color: '#8a9e8a', marginTop: 2 }}>Post to verified buyers instantly</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4a6e4a', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Crop */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Crop</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              {CROPS.map(c => (
                <button key={c} onClick={() => set('crop', c)} style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', border: form.crop === c ? '1px solid rgba(74,158,74,0.5)' : '1px solid rgba(74,158,74,0.15)',
                  background: form.crop === c ? 'rgba(74,158,74,0.18)' : 'rgba(255,255,255,0.04)',
                  color: form.crop === c ? '#7ec87e' : '#8a9e8a',
                  fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label style={labelStyle}>Quantity</label>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <input
                type="number" placeholder="e.g. 2.5"
                value={form.quantity} onChange={e => set('quantity', e.target.value)}
                style={inputStyle}
              />
              <select value={form.unit} onChange={e => set('unit', e.target.value)} style={{ ...inputStyle, width: 70 }}>
                <option>ton</option><option>kg</option>
              </select>
            </div>
          </div>

          {/* Ask price */}
          <div>
            <label style={labelStyle}>Asking Price (R/ton)</label>
            <input
              type="number" placeholder="e.g. 4300" style={{ ...inputStyle, marginTop: 6 }}
              value={form.askPrice} onChange={e => set('askPrice', e.target.value)}
            />
          </div>

          {/* Field */}
          <div>
            <label style={labelStyle}>Source Field</label>
            <select value={form.field} onChange={e => set('field', e.target.value)} style={{ ...inputStyle, marginTop: 6 }}>
              {FIELDS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          {/* Quality */}
          <div>
            <label style={labelStyle}>Quality Grade</label>
            <select value={form.quality} onChange={e => set('quality', e.target.value)} style={{ ...inputStyle, marginTop: 6 }}>
              {QUALITIES.map(q => <option key={q}>{q}</option>)}
            </select>
          </div>

          {/* Description */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Notes for buyers (optional)</label>
            <textarea
              rows={2} placeholder="e.g. pesticide-free, certified, ready for pickup..."
              value={form.description} onChange={e => set('description', e.target.value)}
              style={{ ...inputStyle, marginTop: 6, resize: 'vertical', minHeight: 60 }}
            />
          </div>
        </div>

        {/* Market hint */}
        <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(74,158,74,0.07)', border: '1px solid rgba(74,158,74,0.15)', fontSize: 12, color: '#8a9e8a' }}>
          💡 Current market price for <strong style={{ color: '#7ec87e' }}>{form.crop}</strong>:{' '}
          <strong style={{ color: '#f0f4f0' }}>
            {marketPrices.find(m => m.crop.toLowerCase() === form.crop.toLowerCase())?.price || '—'} /ton
          </strong>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#8a9e8a', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 13 }}>
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => onSubmit(form)}
            style={{
              flex: 2, padding: '11px', borderRadius: 10, cursor: valid ? 'pointer' : 'not-allowed',
              background: valid ? 'linear-gradient(135deg, #2d6a2d, #4a9e4a)' : 'rgba(74,158,74,0.1)',
              border: `1px solid ${valid ? 'rgba(74,158,74,0.5)' : 'rgba(74,158,74,0.1)'}`,
              color: valid ? '#f0f4f0' : '#4a6e4a', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13,
              boxShadow: valid ? '0 4px 16px rgba(45,106,45,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            📢 Post Listing
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 11, color: '#8a9e8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' };
const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,158,74,0.2)',
  color: '#f0f4f0', fontSize: 13, outline: 'none', fontFamily: 'DM Sans, sans-serif',
  boxSizing: 'border-box',
};

// ── Listing Card ───────────────────────────────────────────────────
function ListingCard({ listing, onToggle, onRemove }) {
  const cfg = statusCfg[listing.status];
  return (
    <div style={{
      padding: '18px 20px', borderRadius: 14,
      background: 'linear-gradient(135deg, rgba(30,58,30,0.55) 0%, rgba(15,26,15,0.85) 100%)',
      border: `1px solid ${cfg.border}`,
      transition: 'all 0.2s ease',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 15, color: '#f0f4f0' }}>{listing.crop}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
              {cfg.label}
            </span>
            <span className="chip chip-green" style={{ fontSize: 10 }}>{listing.quality}</span>
          </div>
          <div style={{ fontSize: 12, color: '#8a9e8a' }}>{listing.field} · {listing.quantity} {listing.unit} · Posted {listing.posted}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#f0f4f0' }}>
            R{listing.askPrice.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#8a9e8a' }}>/{listing.unit}</div>
        </div>
      </div>

      {/* Description */}
      {listing.description && (
        <div style={{ fontSize: 12, color: '#8a9e8a', marginBottom: 12, lineHeight: 1.5, padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: 8, borderLeft: '2px solid rgba(74,158,74,0.3)' }}>
          {listing.description}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#8a9e8a' }}>
          <Eye size={13} /> {listing.views} views
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: listing.offers > 0 ? '#e8a020' : '#8a9e8a' }}>
          <MessageSquare size={13} /> {listing.offers} offer{listing.offers !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Best offer */}
      {listing.bestOffer && (
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(74,158,74,0.08)', border: '1px solid rgba(74,158,74,0.2)', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: '#8a9e8a', marginBottom: 2 }}>Best offer</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4f0' }}>{listing.bestOffer.buyer}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#7ec87e' }}>R{listing.bestOffer.price.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: '#4a6e4a' }}>{listing.bestOffer.time}</div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => onToggle(listing.id)}
          style={{
            flex: 1, padding: '7px', borderRadius: 8, cursor: 'pointer',
            background: listing.status === 'active' ? 'rgba(232,160,32,0.1)' : 'rgba(74,158,74,0.1)',
            border: listing.status === 'active' ? '1px solid rgba(232,160,32,0.3)' : '1px solid rgba(74,158,74,0.3)',
            color: listing.status === 'active' ? '#e8a020' : '#7ec87e',
            fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {listing.status === 'active' ? '⏸ Pause' : '▶ Activate'}
        </button>
        {listing.bestOffer && (
          <button style={{
            flex: 2, padding: '7px', borderRadius: 8, cursor: 'pointer',
            background: 'linear-gradient(135deg, #2d6a2d, #4a9e4a)',
            border: '1px solid rgba(74,158,74,0.4)',
            color: '#f0f4f0', fontSize: 12, fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
            boxShadow: '0 4px 12px rgba(45,106,45,0.25)',
          }}>
            ✓ Accept Offer
          </button>
        )}
        <button onClick={() => onRemove(listing.id)} style={{ padding: '7px 10px', borderRadius: 8, cursor: 'pointer', background: 'rgba(200,88,32,0.08)', border: '1px solid rgba(200,88,32,0.2)', color: '#c85820', fontFamily: 'DM Sans, sans-serif' }}>
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function Market() {
  const [tab, setTab]           = useState('prices');
  const [showModal, setModal]   = useState(false);
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [toast, setToast]       = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = (form) => {
    const newListing = {
      id: Date.now(),
      crop: form.crop, quantity: parseFloat(form.quantity),
      unit: form.unit, askPrice: parseFloat(form.askPrice),
      field: form.field, quality: form.quality, status: 'active',
      views: 0, offers: 0, posted: 'Just now',
      description: form.description, bestOffer: null,
    };
    setListings(prev => [newListing, ...prev]);
    setModal(false);
    setTab('listings');
    showToast(`✅ "${form.crop}" listed — visible to ${buyers.length} verified buyers`);
  };

  const toggleStatus = (id) => {
    setListings(prev => prev.map(l =>
      l.id === id ? { ...l, status: l.status === 'active' ? 'paused' : 'active' } : l
    ));
  };

  const removeListing = (id) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const activeCount  = listings.filter(l => l.status === 'active').length;
  const totalOffers  = listings.reduce((s, l) => s + l.offers, 0);
  const totalViews   = listings.reduce((s, l) => s + l.views, 0);

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#f0f4f0', margin: 0, marginBottom: 6 }}>
            🛒 Market & Trade Hub
          </h1>
          <div style={{ fontSize: 14, color: '#8a9e8a' }}>Live commodity prices · Verified buyers · QR traceability</div>
        </div>
        <button
          onClick={() => setModal(true)}
          style={{
            background: 'linear-gradient(135deg, #2d6a2d, #4a9e4a)',
            color: '#f0f4f0', border: 'none', borderRadius: 10,
            padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 4px 16px rgba(45,106,45,0.3)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(45,106,45,0.45)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(45,106,45,0.3)'}
        >
          <Plus size={15} /> List Produce
        </button>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Active Listings',  value: activeCount,  icon: <Package size={16} />, color: '#7ec87e' },
          { label: 'Total Offers',     value: totalOffers,  icon: <MessageSquare size={16} />, color: '#e8a020' },
          { label: 'Listing Views',    value: totalViews,   icon: <Eye size={16} />, color: '#80c0f0' },
          { label: 'Verified Buyers',  value: buyers.length, icon: <CheckCircle size={16} />, color: '#7ec87e' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ color: s.color, opacity: 0.8 }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#8a9e8a', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <TabBtn id="prices"   active={tab === 'prices'}   onClick={setTab}>📈 Live Prices</TabBtn>
        <TabBtn id="listings" active={tab === 'listings'} onClick={setTab}>📦 My Listings {listings.length > 0 && `(${listings.length})`}</TabBtn>
        <TabBtn id="buyers"   active={tab === 'buyers'}   onClick={setTab}>🤝 Verified Buyers</TabBtn>
        <TabBtn id="qr"       active={tab === 'qr'}       onClick={setTab}>📱 QR Traceability</TabBtn>
      </div>

      {/* ── Tab: Live Prices ── */}
      {tab === 'prices' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {marketPrices.map(m => (
              <div key={m.crop} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: '#8a9e8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.crop}</div>
                  <span className="status-dot status-ok" />
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#f0f4f0', lineHeight: 1 }}>{m.price}</div>
                <div style={{ fontSize: 12, color: '#8a9e8a', marginTop: 2, marginBottom: 10 }}>{m.unit}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: m.trend === 'up' ? '#7ec87e' : '#f08060', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <TrendingUp size={13} /> {m.change}
                  </div>
                  <div style={{ fontSize: 11, color: '#4a9e4a' }}>👤 {m.buyers} buyers</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: '20px 24px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 4 }}>4-Week Price Trends</div>
            <div style={{ fontSize: 12, color: '#8a9e8a', marginBottom: 16 }}>Rand per ton · All crops</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={priceHistory} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="week" tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="maize"    name="Maize"    fill="#7ec87e" radius={[3,3,0,0]} />
                <Bar dataKey="tomatoes" name="Tomatoes" fill="#e8a020" radius={[3,3,0,0]} />
                <Bar dataKey="spinach"  name="Spinach"  fill="#80c0f0" radius={[3,3,0,0]} />
                <Bar dataKey="sorghum"  name="Sorghum"  fill="#a080e0" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ── Tab: My Listings ── */}
      {tab === 'listings' && (
        <div>
          {listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#8a9e8a' }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>📦</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#f0f4f0', marginBottom: 6 }}>No listings yet</div>
              <div style={{ fontSize: 13, marginBottom: 20 }}>Post your first produce listing to reach verified buyers</div>
              <button onClick={() => setModal(true)} style={{ padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #2d6a2d, #4a9e4a)', color: '#f0f4f0', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                + List Produce
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {listings.map(l => (
                <ListingCard key={l.id} listing={l} onToggle={toggleStatus} onRemove={removeListing} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Verified Buyers ── */}
      {tab === 'buyers' && (
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
      )}

      {/* ── Tab: QR Traceability ── */}
      {tab === 'qr' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 4 }}>QR Traceability</div>
            <div style={{ fontSize: 12, color: '#8a9e8a', marginBottom: 20 }}>Prove quality to premium buyers</div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ display: 'inline-block', padding: 14, background: 'white', borderRadius: 12 }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  {[...Array(10)].map((_, row) => [...Array(10)].map((_, col) => {
                    const on = (row + col) % 2 === 0 || (row < 3 && col < 3) || (row < 3 && col > 6) || (row > 6 && col < 3);
                    return on ? <rect key={`${row}-${col}`} x={col*10} y={row*10} width={9} height={9} fill="#1e3a1e" rx={1} /> : null;
                  }))}
                </svg>
              </div>
              <div style={{ fontSize: 11, color: '#4a9e4a', marginTop: 8, fontWeight: 600 }}>FM-A-2026-0330-MAIZE</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Field',              val: 'Field A · North Plot' },
                { label: 'Harvest Date',       val: '12 April 2026 (est.)' },
                { label: 'Pesticide-free',     val: '✓ 28 days clear' },
                { label: 'Moisture at harvest',val: '14.2%' },
                { label: 'Certifications',     val: 'GAP Compliant' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(74,158,74,0.1)', fontSize: 12 }}>
                  <span style={{ color: '#8a9e8a' }}>{r.label}</span>
                  <span style={{ color: '#f0f4f0', fontWeight: 600 }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f4f0', marginBottom: 16 }}>Why QR Traceability?</div>
            {[
              { icon: '💰', title: 'Premium pricing',   desc: 'Verified produce commands 8–15% more from retailers and exporters.' },
              { icon: '🤝', title: 'Buyer trust',        desc: 'Scan-to-verify gives buyers instant confidence before committing.' },
              { icon: '📋', title: 'Compliance ready',   desc: 'Export documentation auto-generated from your farm data.' },
              { icon: '🔒', title: 'Tamper-proof',       desc: 'QR codes are unique per batch — cannot be reused or faked.' },
            ].map(r => (
              <div key={r.title} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{r.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#f0f4f0', marginBottom: 3 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: '#8a9e8a', lineHeight: 1.5 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showModal && <ListingModal onClose={() => setModal(false)} onSubmit={handleSubmit} />}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 300,
          background: 'linear-gradient(135deg, rgba(20,48,20,0.99), rgba(10,25,10,0.99))',
          border: '1px solid rgba(74,158,74,0.45)', borderRadius: 14,
          padding: '14px 20px', fontSize: 13, color: '#f0f4f0', fontWeight: 600,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'slide-in 0.3s ease forwards', maxWidth: 360,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}