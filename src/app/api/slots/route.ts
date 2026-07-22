import { NextRequest, NextResponse } from 'next/server';
import { ensureSeed } from '@/lib/prisma';
import { generateSlots } from '@/lib/slots';

export async function GET(req: NextRequest) {
  await ensureSeed();
  const serviceId = req.nextUrl.searchParams.get('serviceId');
  const date = req.nextUrl.searchParams.get('date');

  if (!serviceId || !date) {
    return NextResponse.json(
      { error: 'serviceId and date required' },
      { status: 400 },
    );
  }

  try {
    const slots = await generateSlots(serviceId, date);
    return NextResponse.json(slots);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
