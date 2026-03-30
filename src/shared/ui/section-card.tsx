import type { PropsWithChildren, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

interface SectionCardProps extends PropsWithChildren {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  description,
  action,
  className,
  children,
}: SectionCardProps) {
  return (
    <section className={cn('surface-card', className)}>
      {title || description || action ? (
        <header className="surface-card__header">
          <div>
            {title ? <h3 className="surface-card__title">{title}</h3> : null}
            {description ? <p className="surface-card__description">{description}</p> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
