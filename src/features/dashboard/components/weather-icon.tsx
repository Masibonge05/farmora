import type { LucideProps } from 'lucide-react';
import {
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
  Sun,
} from 'lucide-react';

import type { WeatherIconKey } from '@/core/domain/dashboard/entities';

const iconMap = {
  sun: Sun,
  'cloud-sun': CloudSun,
  'cloud-rain': CloudRain,
  'cloud-lightning': CloudLightning,
  'cloud-moon': CloudMoon,
} satisfies Record<WeatherIconKey, React.ComponentType<LucideProps>>;

interface WeatherIconProps extends LucideProps {
  icon: WeatherIconKey;
}

export function WeatherIcon({ icon, ...props }: WeatherIconProps) {
  const Icon = iconMap[icon];

  return <Icon {...props} />;
}
