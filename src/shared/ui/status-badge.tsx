import { cn } from '@/shared/lib/cn';

type BadgeTone = 'good' | 'warning' | 'critical' | 'info';

const toneClassMap: Record<BadgeTone, string> = {
  good: 'badge-good',
  warning: 'badge-warning',
  critical: 'badge-critical',
  info: 'badge-info',
};

interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
}

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return <span className={cn('status-badge', toneClassMap[tone])}>{label}</span>;
}
