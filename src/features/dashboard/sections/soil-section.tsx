'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Droplets, FlaskConical, Leaf, Thermometer } from 'lucide-react';

import type { DashboardSnapshot } from '@/core/domain/dashboard/entities';
import { SectionCard } from '@/shared/ui/section-card';
import { StatusBadge } from '@/shared/ui/status-badge';

interface SoilSectionProps {
  snapshot: DashboardSnapshot;
}

function NutrientBar({
  label,
  value,
  optimal,
}: {
  label: string;
  value: number;
  optimal: number;
}) {
  const tone = value < optimal * 0.7 ? 'critical' : value < optimal ? 'warning' : 'good';

  return (
    <div className="nutrient-bar">
      <div className="nutrient-bar__header">
        <span>{label}</span>
        <StatusBadge label={`${value}%`} tone={tone} />
      </div>
      <div className="nutrient-bar__track">
        <div className="nutrient-bar__fill" style={{ width: `${value}%` }} />
        <div className="nutrient-bar__target" style={{ left: `${optimal}%` }} />
      </div>
    </div>
  );
}

export function SoilSection({ snapshot }: SoilSectionProps) {
  return (
    <div className="section-stack">
      <div className="page-section-head">
        <span className="eyebrow">Soil and water</span>
        <h1>Sensor-backed irrigation and nutrient insight</h1>
        <p>
          Real-time soil metrics, irrigation posture, and nutrient drift translated into decisions
          the field team can actually use.
        </p>
      </div>

      <div className="grid-cols-4">
        {snapshot.soil.nodes.map((node) => (
          <SectionCard key={node.id} className="sensor-card">
            <div className="sensor-card__head">
              <div>
                <strong>{node.field}</strong>
                <p>{node.id}</p>
              </div>
              <StatusBadge
                label={node.moisture < 35 ? 'Critical' : node.moisture < 55 ? 'Watch' : 'Healthy'}
                tone={node.moisture < 35 ? 'critical' : node.moisture < 55 ? 'warning' : 'good'}
              />
            </div>
            <div className="sensor-card__grid">
              <div>
                <Droplets size={15} />
                <strong>{node.moisture}%</strong>
                <span>Moisture</span>
              </div>
              <div>
                <FlaskConical size={15} />
                <strong>{node.pH}</strong>
                <span>pH</span>
              </div>
              <div>
                <Thermometer size={15} />
                <strong>{node.temp}°C</strong>
                <span>Temp</span>
              </div>
              <div>
                <Leaf size={15} />
                <strong>{node.nitrogen}%</strong>
                <span>Nitrogen</span>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="grid-cols-2">
        <SectionCard title="24h trends" description="Moisture, temperature, and pH across Field A.">
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={snapshot.soil.metrics}>
                <CartesianGrid stroke="rgba(212, 231, 193, 0.08)" vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#a8ba95' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#a8ba95' }} />
                <Tooltip
                  contentStyle={{
                    background: '#102116',
                    border: '1px solid rgba(154, 217, 110, 0.18)',
                    borderRadius: 16,
                  }}
                />
                <ReferenceLine y={50} stroke="rgba(239, 187, 87, 0.4)" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="moisture" stroke="#5db8ff" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="temp" stroke="#efbb57" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pH" stroke="#8fd17c" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Nutrient guidance"
          description="The current nutrient balance for the field that needs the most intervention."
        >
          <NutrientBar label="Nitrogen (N)" value={58} optimal={80} />
          <NutrientBar label="Phosphorus (P)" value={44} optimal={70} />
          <NutrientBar label="Potassium (K)" value={55} optimal={75} />
          <NutrientBar label="Organic matter" value={62} optimal={70} />
        </SectionCard>
      </div>

      <SectionCard
        title="Recommendations"
        description="Practical interventions generated from current moisture and nutrient data."
      >
        <div className="grid-cols-3">
          {snapshot.soil.recommendations.map((item) => (
            <article key={item.title} className="recommendation-card">
              <div className="recommendation-card__field">{item.field}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
