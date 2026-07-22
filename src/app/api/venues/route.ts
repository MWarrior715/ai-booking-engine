import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const venues = await prisma.venue.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(venues);
}
