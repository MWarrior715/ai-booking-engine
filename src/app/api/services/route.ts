import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const venueId = req.nextUrl.searchParams.get('venueId');
  if (!venueId) {
    return NextResponse.json({ error: 'venueId required' }, { status: 400 });
  }

  const services = await prisma.service.findMany({
    where: { venueId },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(services);
}
