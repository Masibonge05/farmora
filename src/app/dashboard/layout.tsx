import type { ReactNode } from 'react';

import { getDashboardSnapshot } from '@/core/infrastructure/dashboard-module';
import { DashboardFrame } from '@/features/dashboard/components/dashboard-frame';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const snapshot = await getDashboardSnapshot();

  return <DashboardFrame snapshot={snapshot}>{children}</DashboardFrame>;
}
