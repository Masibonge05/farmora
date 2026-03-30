import { NextResponse } from 'next/server';
import { z } from 'zod';

import { dashboardSections } from '@/core/domain/dashboard/entities';
import { getDashboardSection } from '@/core/infrastructure/dashboard-module';

const sectionSchema = z.enum(dashboardSections);

export async function GET(
  _request: Request,
  context: { params: Promise<{ section: string }> },
) {
  const { section } = await context.params;
  const parsedSection = sectionSchema.safeParse(section);

  if (!parsedSection.success) {
    return NextResponse.json(
      {
        error: 'Unknown dashboard section',
      },
      { status: 404 },
    );
  }

  const data = await getDashboardSection(parsedSection.data);

  return NextResponse.json({
    section: parsedSection.data,
    data,
    generatedAt: new Date().toISOString(),
  });
}
