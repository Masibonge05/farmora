import type { DashboardSnapshot } from '@/core/domain/dashboard/entities';

export interface DashboardRepository {
  getSnapshot(): Promise<DashboardSnapshot>;
}
