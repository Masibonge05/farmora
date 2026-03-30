import { soilMetrics } from '../data/dummyData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertTriangle, CheckCircle2, Droplets, FlaskConical, Leaf, Thermometer, Waves } from 'lucide-react';

const soilNodes = [
  { id: 'SN-01', field: 'Field A', moisture: 68, pH: 6.4, temp: 24, nitrogen: 85, phosphorus: 62, potassium: 78 },
  { id: 'SN-02', field: 'Field B', moisture: 42, pH: 6.1, temp: 26, nitrogen: 58, phosphorus: 44, potassium: 55 },
  { id: 'SN-03', field: 'Field C', moisture: 74, pH: 6.7, temp: 22, nitrogen: 88, phosphorus: 70, potassium: 82 },
  { id: 'SN-04', field: 'Field D', moisture: 28, pH: 5.8, temp: 29, nitrogen: 40, phosphorus: 35, potassium: 42 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'rgba(15,26,15,0.95)', border: '1px solid rgba(74,158,74,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
        <div style={{ color: '#7ec87e', fontWeight: 600, marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, display: 'flex', gap: 8, marginBottom: 2 }}>
            <span>{p.name}:</span><span style={{ fontWeight: 600 }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function NutrientBar({ label, value, color, optimal }) {
  const isLow = value < optimal * 0.7;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: '#8a9e8a' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: isLow ? '#c85820' : '#7ec87e' }}>{value}%</span>
      </div>
      <div style={{ height: 7, background: 'rgba(255,255,255,0.07)', borderRadius: 4, position: 'relative' }}>
        <div style={{ width: `${value}%`, height: '100%', background: `linear-gradient(90deg, ${color}80, ${color})`, borderRadius: 4 }} />
        {/* Optimal line */}
        <div style={{ position: 'absolute', left: `${optimal}%`, top: -3, bottom: -3, width: 1, background: 'rgba(255,255,255,0.2)' }} />
      </div>
      <div style={{ fontSize: 10, color: isLow ? '#f08060' : '#4a6e4a', marginTop: 3 }}>
        {isLow ? 'Below optimal - consider fertiliser' : 'Within optimal range'}
      </div>
    </div>
  );
}

export default function SoilWater() {
  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Droplets size={20} color="#80c0f0" />
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: 600, color: '#f0f4f0', margin: 0, marginBottom: 6 }}>
            Soil & Water Analytics
          </h1>
        </div>
        <div style={{ fontSize: 14, color: '#8a9e8a' }}>Real-time IoT sensor data · Moisture, nutrients, pH, and temperature</div>
      </div>

      {/* Sensor cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {soilNodes.map(node => {
          const moistColor = node.moisture < 40 ? '#c85820' : node.moisture < 55 ? '#e8a020' : '#7ec87e';
          return (
            <div key={node.id} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 14, color: '#f0f4f0' }}>{node.field}</div>
                  <div style={{ fontSize: 10, color: '#4a9e4a', marginTop: 1 }}>{node.id}</div>
                </div>
                <span className="status-dot" style={{ background: moistColor, boxShadow: `0 0 8px ${moistColor}` }}></span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Moisture', val: `${node.moisture}%`, color: '#80c0f0', Icon: Droplets },
                  { label: 'pH Level', val: node.pH, color: node.pH < 6.0 ? '#e8a020' : '#7ec87e', Icon: FlaskConical },
                  { label: 'Temp', val: `${node.temp}°C`, color: '#e8a020', Icon: Thermometer },
                  { label: 'N Level', val: `${node.nitrogen}%`, color: '#7ec87e', Icon: Leaf },
                ].map((item) => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}><item.Icon size={14} color={item.color} /></div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: item.color }}>{item.val}</div>
                    <div style={{ fontSize: 10, color: '#8a9e8a' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Time series */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 4 }}>
            24h Sensor Trends — Field A
          </div>
          <div style={{ fontSize: 12, color: '#8a9e8a', marginBottom: 16 }}>Moisture %, Temperature °C, pH</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={soilMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8a9e8a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={50} stroke="rgba(232,160,32,0.3)" strokeDasharray="4 4" label={{ value: 'Min moisture', fill: '#e8a020', fontSize: 10, position: 'insideTopRight' }} />
              <Line type="monotone" dataKey="moisture" name="Moisture %" stroke="#80c0f0" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="temp" name="Temp °C" stroke="#e8a020" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pH" name="pH" stroke="#7ec87e" strokeWidth={2} dot={{ r: 3, fill: '#7ec87e' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Nutrient levels */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 4 }}>
            Soil Nutrients — Field B
          </div>
          <div style={{ fontSize: 12, color: '#8a9e8a', marginBottom: 20 }}>N-P-K analysis · Requires attention</div>
          <NutrientBar label="Nitrogen (N)" value={58} color="#7ec87e" optimal={80} />
          <NutrientBar label="Phosphorus (P)" value={44} color="#e8a020" optimal={70} />
          <NutrientBar label="Potassium (K)" value={55} color="#80c0f0" optimal={75} />
          <NutrientBar label="Organic Matter" value={62} color="#a080e0" optimal={70} />
          
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(232,160,32,0.08)', borderRadius: 10, border: '1px solid rgba(232,160,32,0.2)' }}>
            <div style={{ fontSize: 12, color: '#e8a020', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={12} /> Fertiliser Recommendation</div>
            <div style={{ fontSize: 12, color: '#8a9e8a', lineHeight: 1.5 }}>
              Apply NPK 2:3:2 at 200kg/ha. Prioritise phosphorus for tomato root development.
            </div>
          </div>
        </div>
      </div>

      {/* Irrigation schedule */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#f0f4f0', marginBottom: 16 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Waves size={16} /> Irrigation Schedule & Recommendations</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {soilNodes.map(node => {
            const needsIrrigation = node.moisture < 50;
            const urgency = node.moisture < 35 ? 'Critical' : node.moisture < 50 ? 'Moderate' : 'On Track';
            const urgencyColor = node.moisture < 35 ? '#c85820' : node.moisture < 50 ? '#e8a020' : '#7ec87e';
            const nextIrrigation = node.moisture < 35 ? 'Now' : node.moisture < 50 ? 'Today 18:00' : 'Tomorrow 06:00';
            return (
              <div key={node.id} style={{ 
                padding: '14px 16px', borderRadius: 12,
                background: needsIrrigation ? 'rgba(58,140,200,0.08)' : 'rgba(74,158,74,0.05)',
                border: `1px solid ${needsIrrigation ? 'rgba(58,140,200,0.25)' : 'rgba(74,158,74,0.15)'}`,
              }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#f0f4f0', marginBottom: 4 }}>{node.field}</div>
                <div style={{ margin: '8px 0' }}><Droplets size={20} color="#80c0f0" /></div>
                <div style={{ fontSize: 22, fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: urgencyColor }}>{node.moisture}%</div>
                <div style={{ fontSize: 11, color: '#8a9e8a', marginBottom: 8 }}>current moisture</div>
                <div style={{ fontSize: 11, color: urgencyColor, fontWeight: 600, marginBottom: 4 }}>{urgency}</div>
                <div style={{ fontSize: 11, color: '#8a9e8a' }}>Next: <span style={{ color: '#f0f4f0' }}>{nextIrrigation}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
