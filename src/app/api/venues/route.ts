import { NextResponse } from 'next/server';
import { ensureSeed, prisma } from '@/lib/prisma';

export async function GET() {
  await ensureSeed();
  const venues = await prisma.venue.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(venues);
}
