'use client';

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Bot, Leaf, ScanSearch } from 'lucide-react';

import type { DashboardSnapshot, HealthStatus } from '@/core/domain/dashboard/entities';
import { SectionCard } from '@/shared/ui/section-card';
import { StatusBadge } from '@/shared/ui/status-badge';

const statusToneMap: Record<HealthStatus, 'good' | 'warning' | 'critical'> = {
  healthy: 'good',
  warning: 'warning',
  alert: 'critical',
};

interface CropHealthSectionProps {
  snapshot: DashboardSnapshot;
}

export function CropHealthSection({ snapshot }: CropHealthSectionProps) {
  return (
    <div className="section-stack">
      <div className="page-section-head">
        <span className="eyebrow">Crop health</span>
        <h1>NDVI and disease detection across active fields</h1>
        <p>
          Field-level vegetation signals, disease confidence scores, and the AI recommendations
          that translate them into action.
        </p>
      </div>

      <div className="grid-cols-4">
        {snapshot.cropHealth.fields.map((field) => (
          <SectionCard key={field.id} className="field-health-card">
            <div className="field-health-card__score">
              <span>{(field.ndvi * 100).toFixed(0)}</span>
              <small>NDVI</small>
            </div>
            <div>
              <strong>{field.crop}</strong>
              <p>
                {field.location} · {field.hectares} ha
              </p>
            </div>
            <div className="field-health-card__footer">
              <span>{field.moisture}% moisture</span>
              <StatusBadge label={field.status} tone={statusToneMap[field.status]} />
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="grid-cols-2">
        <SectionCard
          title="Multi-parameter health radar"
          description="Comparing growth, nutrient, and risk indicators across fields."
        >
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={snapshot.cropHealth.radarMetrics}>
                <PolarGrid stroke="rgba(212, 231, 193, 0.1)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#a8ba95', fontSize: 11 }} />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Radar name="Field A" dataKey="A" stroke="#8fd17c" fill="#8fd17c" fillOpacity={0.16} />
                <Radar name="Field B" dataKey="B" stroke="#efbb57" fill="#efbb57" fillOpacity={0.12} />
                <Radar name="Field C" dataKey="C" stroke="#5db8ff" fill="#5db8ff" fillOpacity={0.1} />
                <Tooltip
                  contentStyle={{
                    background: '#102116',
                    border: '1px solid rgba(154, 217, 110, 0.18)',
                    borderRadius: 16,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Disease detection queue"
          description="Latest vision model output and recommended responses."
        >
          <div className="list-stack">
            {snapshot.cropHealth.diseaseScans.map((scan) => (
              <article key={`${scan.field}-${scan.disease}`} className="scan-card">
                <div className="scan-card__header">
                  <div>
                    <strong>{scan.field}</strong>
                    <p>{scan.disease}</p>
                  </div>
                  <StatusBadge
                    label={`${scan.confidence}% confidence`}
                    tone={
                      scan.severity === 'High'
                        ? 'critical'
                        : scan.severity === 'Moderate'
                          ? 'warning'
                          : 'good'
                    }
                  />
                </div>
                <p className="scan-card__copy">{scan.action}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="AI recommendations"
        description="Decision support generated from current crop, disease, and yield signals."
      >
        <div className="grid-cols-3">
          {snapshot.cropHealth.recommendations.map((item) => (
            <article key={item.title} className="recommendation-card">
              <div className="recommendation-card__icon">
                {item.tone === 'info' ? <Bot size={18} /> : item.tone === 'warning' ? <Leaf size={18} /> : <ScanSearch size={18} />}
              </div>
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
