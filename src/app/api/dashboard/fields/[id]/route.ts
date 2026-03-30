import { NextResponse } from 'next/server';

import { mockDashboardSnapshot } from '@/core/infrastructure/mock-dashboard-snapshot';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const field = mockDashboardSnapshot.cropHealth.fields.find(
    (f) => String(f.id) === String(id) || f.name === id,
  );

  if (!field) {
    return NextResponse.json({ error: 'Field not found' }, { status: 404 });
  }

  return NextResponse.json({
    data: field,
    generatedAt: new Date().toISOString(),
  });
}
