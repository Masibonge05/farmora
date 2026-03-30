'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertTriangle,
  Bell,
  CloudRain,
  LayoutDashboard,
  Leaf,
  LogOut,
  MessageCircle,
  Settings,
  ShoppingCart,
  Wifi,
} from 'lucide-react';

import type { DashboardSnapshot } from '@/core/domain/dashboard/entities';
import { dashboardNavigation } from '@/features/dashboard/config';
import { cn } from '@/shared/lib/cn';

const navIconMap = {
  overview: LayoutDashboard,
  'crop-health': Leaf,
  soil: CloudRain,
  alerts: AlertTriangle,
  market: ShoppingCart,
  sensors: Wifi,
  weather: CloudRain,
};

interface SidebarNavProps {
  snapshot: DashboardSnapshot;
}

export function SidebarNav({ snapshot }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar__brand">
        <div className="brand-mark">F</div>
        <div>
          <div className="brand-title">Farmora</div>
          <div className="brand-subtitle">Precision Ag OS</div>
        </div>
      </div>

      <div className="farm-switcher">
        <span className="farm-switcher__label">Active farm</span>
        <strong>{snapshot.farm.name}</strong>
        <span className="farm-switcher__meta">
          {snapshot.farm.region}, RSA · {snapshot.farm.hectares} ha
        </span>
      </div>

      <nav className="dashboard-nav">
        {dashboardNavigation.map((item) => {
          const Icon = navIconMap[item.id];
          const href = `/dashboard/${item.id}`;
          const active = pathname === href;

          return (
            <Link key={item.id} href={href} className={cn('dashboard-nav__item', active && 'is-active')}>
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="dashboard-sidebar__footer">
        <div className="dashboard-nav__item dashboard-nav__item--static">
          <Bell size={16} />
          <span>Notifications</span>
        </div>
        <div className="dashboard-nav__item dashboard-nav__item--static">
          <Settings size={16} />
          <span>Settings</span>
        </div>
        <div className="dashboard-nav__item dashboard-nav__item--static dashboard-nav__item--danger">
          <LogOut size={16} />
          <span>Sign out</span>
        </div>

        <div className="ai-card">
          <span className="ai-card__eyebrow">AI assistant</span>
          <p>Ask about crop health, trade timing, or how to respond to a field alert.</p>
          <button type="button" className="secondary-button">
            <MessageCircle size={14} />
            Ask Farmora AI
          </button>
        </div>
      </div>
    </aside>
  );
}
