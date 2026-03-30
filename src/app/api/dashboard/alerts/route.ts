import { NextResponse } from 'next/server';

import { mockDashboardSnapshot } from '@/core/infrastructure/mock-dashboard-snapshot';

export async function GET() {
  return NextResponse.json({
    data: mockDashboardSnapshot.alerts.items ?? mockDashboardSnapshot.alerts ?? [],
    generatedAt: new Date().toISOString(),
  });
}
