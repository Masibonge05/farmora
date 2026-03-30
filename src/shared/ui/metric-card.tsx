import type { DashboardKpi } from '@/core/domain/dashboard/entities';

import { cn } from '@/shared/lib/cn';

const toneClassMap: Record<DashboardKpi['tone'], string> = {
  good: 'tone-good',
  warning: 'tone-warning',
  critical: 'tone-critical',
  info: 'tone-info',
};

export function MetricCard({ label, value, detail, tone }: DashboardKpi) {
  return (
    <article className={cn('metric-card', toneClassMap[tone])}>
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value">{value}</strong>
      <p className="metric-card__detail">{detail}</p>
    </article>
  );
}
