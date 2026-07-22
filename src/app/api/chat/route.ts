import { NextRequest, NextResponse } from 'next/server';
import { ensureSeed, prisma } from '@/lib/prisma';
import { chatSuggestion } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    await ensureSeed();
    const { venueId, message } = await req.json();

    if (!venueId || !message) {
      return NextResponse.json(
        { error: 'venueId and message required' },
        { status: 400 },
      );
    }

    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      include: { services: true },
    });

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    const reply = await chatSuggestion(
      venue.name,
      venue.services.map((s) => ({ name: s.name, durationMin: s.durationMin })),
      message,
    );

    return NextResponse.json({ reply });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
