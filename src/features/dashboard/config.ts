import type { DashboardSection } from '@/core/domain/dashboard/entities';

export const dashboardNavigation: Array<{
  id: DashboardSection;
  label: string;
  description: string;
}> = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Farm-wide operational summary',
  },
  {
    id: 'crop-health',
    label: 'Crop Health',
    description: 'NDVI analysis and disease detection',
  },
  {
    id: 'soil',
    label: 'Soil & Water',
    description: 'Moisture, nutrients, and irrigation signals',
  },
  {
    id: 'alerts',
    label: 'Alerts',
    description: 'Urgent notifications and action queues',
  },
  {
    id: 'market',
    label: 'Market',
    description: 'Commodity pricing and buyer opportunities',
  },
  {
    id: 'sensors',
    label: 'Sensors',
    description: 'IoT fleet health and network telemetry',
  },
  {
    id: 'weather',
    label: 'Weather',
    description: 'Forecast-informed irrigation planning',
  },
];
