'use client';

import type { PropsWithChildren } from 'react';

import type { DashboardSnapshot } from '@/core/domain/dashboard/entities';

import { DashboardTopbar } from './dashboard-topbar';
import { SidebarNav } from './sidebar-nav';

interface DashboardFrameProps extends PropsWithChildren {
  snapshot: DashboardSnapshot;
}

export function DashboardFrame({ snapshot, children }: DashboardFrameProps) {
  return (
    <div className="dashboard-shell">
      <SidebarNav snapshot={snapshot} />
      <div className="dashboard-main">
        <DashboardTopbar snapshot={snapshot} />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
