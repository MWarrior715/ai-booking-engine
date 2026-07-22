import { NextRequest, NextResponse } from 'next/server';
import { bookSlot } from '@/lib/slots';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, startAt, customerName, customerEmail, customerPhone, notes, venueId } = body;

    if (!serviceId || !startAt || !customerName) {
      return NextResponse.json(
        { error: 'serviceId, startAt and customerName required' },
        { status: 400 },
      );
    }

    const booking = await bookSlot(
      serviceId,
      new Date(startAt),
      customerName,
      customerEmail,
      customerPhone,
      notes,
    );

    // Emitir a clientes conectados del venue.
    const io = (global as unknown as { io?: import('socket.io').Server }).io;
    if (io && venueId) {
      io.to(`venue:${venueId}`).emit('booking:created', booking);
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    if (message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Slot already booked' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
