import { CloudSun, MapPin } from 'lucide-react';

import type { DashboardSnapshot } from '@/core/domain/dashboard/entities';

interface DashboardTopbarProps {
  snapshot: DashboardSnapshot;
}

export function DashboardTopbar({ snapshot }: DashboardTopbarProps) {
  return (
    <header className="dashboard-topbar">
      <div>
        <p className="dashboard-topbar__meta">
          <MapPin size={14} />
          <span>
            {snapshot.farm.name} · {snapshot.farm.location}
          </span>
        </p>
      </div>

      <div className="dashboard-topbar__status">
        <span className="live-pill">{snapshot.farm.sensorCoverageLabel}</span>
        <span className="weather-pill">
          <CloudSun size={14} />
          {snapshot.farm.liveTemperatureC}°C live
        </span>
        <span className="avatar-token">{snapshot.farm.farmerName.charAt(0)}</span>
      </div>
    </header>
  );
}
