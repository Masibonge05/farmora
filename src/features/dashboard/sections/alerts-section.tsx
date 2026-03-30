'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, BellRing, CheckCircle2, Info, Zap } from 'lucide-react';

import type { AlertItem, DashboardSnapshot } from '@/core/domain/dashboard/entities';
import { SectionCard } from '@/shared/ui/section-card';
import { StatusBadge } from '@/shared/ui/status-badge';

const toneMap = {
  alert: 'critical',
  warning: 'warning',
  info: 'info',
  success: 'good',
} as const;

const iconMap = {
  alert: AlertTriangle,
  warning: Zap,
  info: Info,
  success: CheckCircle2,
};

interface AlertsSectionProps {
  snapshot: DashboardSnapshot;
}

export function AlertsSection({ snapshot }: AlertsSectionProps) {
  const [items, setItems] = useState(snapshot.alerts.items);

  const summary = useMemo(
    () => ({
      alert: items.filter((item) => item.type === 'alert').length,
      warning: items.filter((item) => item.type === 'warning').length,
      info: items.filter((item) => item.type === 'info').length,
      success: items.filter((item) => item.type === 'success').length,
    }),
    [items],
  );

  const handleResolve = (alert: AlertItem) => {
    setItems((current) =>
      current.map((item) =>
        item.id === alert.id
          ? {
              ...item,
              type: 'success',
              message: `Runbook launched for ${alert.field}. Team has acknowledged the issue.`,
              time: 'Just now',
            }
          : item,
      ),
    );
  };

  return (
    <div className="section-stack">
      <div className="page-section-head">
        <span className="eyebrow">Alerting</span>
        <h1>Operational notifications and runbook triggers</h1>
        <p>
          A concise action queue for the issues that could impact water, disease, or sensor
          reliability in the next few hours.
        </p>
      </div>

      <div className="grid-cols-4">
        <MetricSummary label="Critical" value={summary.alert} tone="critical" />
        <MetricSummary label="Warnings" value={summary.warning} tone="warning" />
        <MetricSummary label="Informational" value={summary.info} tone="info" />
        <MetricSummary label="Resolved" value={summary.success} tone="good" />
      </div>

      <SectionCard
        title="Alert feed"
        description="Launch a runbook or acknowledge items as the team works them."
      >
        <div className="list-stack">
          {items.map((item) => {
            const Icon = iconMap[item.type];

            return (
              <article key={item.id} className="alert-feed-item">
                <div className="alert-feed-item__icon">
                  <Icon size={18} />
                </div>
                <div className="alert-feed-item__content">
                  <div className="alert-feed-item__header">
                    <div>
                      <strong>{item.field}</strong>
                      <p>{item.time}</p>
                    </div>
                    <StatusBadge label={item.type} tone={toneMap[item.type]} />
                  </div>
                  <p>{item.message}</p>
                </div>
                <button
                  type="button"
                  className="table-action"
                  disabled={item.type === 'success'}
                  onClick={() => handleResolve(item)}
                >
                  {item.type === 'success' ? 'Resolved' : 'Launch runbook'}
                </button>
              </article>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Alerting posture"
        description="The notification layer is connected to irrigation, disease, and field telemetry."
      >
        <div className="grid-cols-3">
          {[
            'Critical irrigation issues escalate directly to the dashboard and next operator.',
            'Disease events are held until confidence crosses a threshold, reducing noisy false positives.',
            'Sensor fleet warnings are grouped so battery maintenance stays operational instead of reactive.',
          ].map((copy) => (
            <article key={copy} className="recommendation-card">
              <div className="recommendation-card__icon">
                <BellRing size={18} />
              </div>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function MetricSummary({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'good' | 'warning' | 'critical' | 'info';
}) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value">{value}</strong>
      <p className="metric-card__detail">Live count in the current alert feed.</p>
    </article>
  );
}
