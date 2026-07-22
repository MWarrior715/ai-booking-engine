import { PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from './prisma';

export interface Slot {
  startAt: Date;
  endAt: Date;
  available: boolean;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

function parseDateUTC(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function parseTimeUTC(timeStr: string, baseDate: Date): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(
    Date.UTC(
      baseDate.getUTCFullYear(),
      baseDate.getUTCMonth(),
      baseDate.getUTCDate(),
      hours,
      minutes,
      0,
      0,
    ),
  );
}

export async function generateSlots(
  serviceId: string,
  dateStr: string,
  prismaInstance: PrismaClient = defaultPrisma,
): Promise<Slot[]> {
  const date = parseDateUTC(dateStr);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  const service = await prismaInstance.service.findUnique({
    where: { id: serviceId },
    include: { venue: { include: { rules: true } }, bookings: true },
  });

  if (!service) {
    throw new Error('Service not found');
  }

  const dayOfWeek = date.getUTCDay();
  const rules = service.venue.rules.filter(
    (r) => r.dayOfWeek === dayOfWeek && (!r.serviceId || r.serviceId === serviceId),
  );

  if (rules.length === 0) {
    return [];
  }

  const duration = service.durationMin;
  const existingBookings = service.bookings.filter(
    (b) => b.status !== 'cancelled' && isSameDayUTC(new Date(b.startAt), date),
  );

  const slots: Slot[] = [];

  for (const rule of rules) {
    let cursor = parseTimeUTC(rule.startTime, date);
    const end = parseTimeUTC(rule.endTime, date);

    while (cursor < end) {
      const slotEnd = addMinutes(cursor, duration);
      if (slotEnd > end) break;

      const isBooked = existingBookings.some(
        (b) => new Date(b.startAt).getTime() === cursor.getTime(),
      );

      slots.push({
        startAt: new Date(cursor),
        endAt: new Date(slotEnd),
        available: !isBooked,
      });

      cursor = slotEnd;
    }
  }

  return slots.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
}

export async function bookSlot(
  serviceId: string,
  startAt: Date,
  customerName: string,
  customerEmail?: string,
  customerPhone?: string,
  notes?: string,
  prismaInstance: PrismaClient = defaultPrisma,
) {
  return prismaInstance.booking.create({
    data: {
      serviceId,
      startAt,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    },
  });
}

function isSameDayUTC(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}
