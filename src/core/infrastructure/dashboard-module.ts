import { cache } from 'react';

import { GetDashboardSectionUseCase, GetDashboardSnapshotUseCase } from '@/core/application/dashboard/use-cases';
import type { DashboardSection } from '@/core/domain/dashboard/entities';

import { InMemoryDashboardRepository } from './in-memory-dashboard-repository';

const dashboardRepository = new InMemoryDashboardRepository();
const getDashboardSnapshotUseCase = new GetDashboardSnapshotUseCase(dashboardRepository);
const getDashboardSectionUseCase = new GetDashboardSectionUseCase(dashboardRepository);

export const getDashboardSnapshot = cache(() => getDashboardSnapshotUseCase.execute());

export const getDashboardSection = cache((section: DashboardSection) =>
  getDashboardSectionUseCase.execute(section),
);
