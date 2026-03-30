'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, Leaf, TrendingUp } from 'lucide-react';

import type { DashboardSnapshot, HealthStatus } from '@/core/domain/dashboard/entities';
import { MetricCard } from '@/shared/ui/metric-card';
import { SectionCard } from '@/shared/ui/section-card';
import { StatusBadge } from '@/shared/ui/status-badge';

const statusToneMap: Record<HealthStatus, 'good' | 'warning' | 'critical'> = {
  healthy: 'good',
  warning: 'warning',
  alert: 'critical',
};

interface OverviewSectionProps {
  snapshot: DashboardSnapshot;
}

export function OverviewSection({ snapshot }: OverviewSectionProps) {
  return (
    <div className="section-stack">
      <div className="page-section-head">
        <span className="eyebrow">Operations overview</span>
        <h1>Farm-wide performance at a glance</h1>
        <p>
          A single operational picture for field health, yield forecast, and the next decisions
          that should happen on the farm.
        </p>
      </div>

      <div className="grid-cols-4">
        {snapshot.overview.kpis.map((kpi) => (
          <MetricCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid-cols-2">
        <SectionCard
          title="Field operational view"
          description="Status, NDVI score, and moisture posture across every active plot."
        >
          <div className="list-stack">
            {snapshot.cropHealth.fields.map((field) => (
              <article key={field.id} className="data-row">
                <div>
                  <div className="data-row__title">{field.name}</div>
                  <div className="data-row__subtitle">
                    {field.location} · {field.hectares} ha · last scan {field.lastScan}
                  </div>
                </div>
                <div className="data-row__metrics">
                  <span className="metric-inline">NDVI {(field.ndvi * 100).toFixed(0)}</span>
                  <span className="metric-inline">{field.moisture}% moisture</span>
                  <StatusBadge label={field.status} tone={statusToneMap[field.status]} />
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Yield forecast"
          description="Actual output vs projected output per month."
        >
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={snapshot.overview.yieldForecast}>
                <defs>
                  <linearGradient id="yield-forecast" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#8fd17c" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#8fd17c" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(212, 231, 193, 0.08)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#a8ba95' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#a8ba95' }} />
                <Tooltip
                  contentStyle={{
                    background: '#102116',
                    border: '1px solid rgba(154, 217, 110, 0.18)',
                    borderRadius: 16,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="#8fd17c"
                  strokeWidth={3}
                  fill="url(#yield-forecast)"
                />
                <Area type="monotone" dataKey="actual" stroke="#5db8ff" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Recommended next actions"
        description="The highest-signal tasks generated from crop, weather, and trade data."
      >
        <div className="grid-cols-3">
          {snapshot.overview.recommendations.map((item) => (
            <article key={item.title} className="recommendation-card">
              <div className="recommendation-card__icon">
                {item.tone === 'critical' ? (
                  <Activity size={18} />
                ) : item.tone === 'warning' ? (
                  <Leaf size={18} />
                ) : (
                  <TrendingUp size={18} />
                )}
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
