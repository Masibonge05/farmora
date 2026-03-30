import type {
  DashboardSection,
  DashboardSnapshot,
} from '@/core/domain/dashboard/entities';
import type { DashboardRepository } from '@/core/ports/dashboard-repository';

export class GetDashboardSnapshotUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  execute(): Promise<DashboardSnapshot> {
    return this.dashboardRepository.getSnapshot();
  }
}

export class GetDashboardSectionUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(section: DashboardSection) {
    const snapshot = await this.dashboardRepository.getSnapshot();

    switch (section) {
      case 'overview':
        return snapshot.overview;
      case 'crop-health':
        return snapshot.cropHealth;
      case 'soil':
        return snapshot.soil;
      case 'alerts':
        return snapshot.alerts;
      case 'market':
        return snapshot.market;
      case 'sensors':
        return snapshot.sensors;
      case 'weather':
        return snapshot.weather;
      default: {
        const exhaustiveCheck: never = section;
        return exhaustiveCheck;
      }
    }
  }
}
