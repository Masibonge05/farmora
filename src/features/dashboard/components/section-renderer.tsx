import type { DashboardSection, DashboardSnapshot } from '@/core/domain/dashboard/entities';

import { AlertsSection } from '@/features/dashboard/sections/alerts-section';
import { CropHealthSection } from '@/features/dashboard/sections/crop-health-section';
import { MarketSection } from '@/features/dashboard/sections/market-section';
import { OverviewSection } from '@/features/dashboard/sections/overview-section';
import { SensorsSection } from '@/features/dashboard/sections/sensors-section';
import { SoilSection } from '@/features/dashboard/sections/soil-section';
import { WeatherSection } from '@/features/dashboard/sections/weather-section';

interface SectionRendererProps {
  section: DashboardSection;
  snapshot: DashboardSnapshot;
}

export function SectionRenderer({ section, snapshot }: SectionRendererProps) {
  switch (section) {
    case 'overview':
      return <OverviewSection snapshot={snapshot} />;
    case 'crop-health':
      return <CropHealthSection snapshot={snapshot} />;
    case 'soil':
      return <SoilSection snapshot={snapshot} />;
    case 'alerts':
      return <AlertsSection snapshot={snapshot} />;
    case 'market':
      return <MarketSection snapshot={snapshot} />;
    case 'sensors':
      return <SensorsSection snapshot={snapshot} />;
    case 'weather':
      return <WeatherSection snapshot={snapshot} />;
    default: {
      const exhaustiveCheck: never = section;
      return exhaustiveCheck;
    }
  }
}
