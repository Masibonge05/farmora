import type { DashboardSnapshot } from '@/core/domain/dashboard/entities';
import type { DashboardRepository } from '@/core/ports/dashboard-repository';

import { mockDashboardSnapshot } from './mock-dashboard-snapshot';

export class InMemoryDashboardRepository implements DashboardRepository {
  async getSnapshot(): Promise<DashboardSnapshot> {
    return structuredClone(mockDashboardSnapshot);
  }
}
