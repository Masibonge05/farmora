import { NextResponse } from 'next/server';

import { getDashboardSnapshot } from '@/core/infrastructure/dashboard-module';

export async function GET() {
  const snapshot = await getDashboardSnapshot();

  return NextResponse.json({
    data: snapshot,
    generatedAt: new Date().toISOString(),
  });
}
