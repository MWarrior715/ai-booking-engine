import { PrismaClient } from '@prisma/client';
import { generateSlots, bookSlot } from '../src/lib/slots';

const prisma = new PrismaClient({
  datasources: { db: { url: 'file:./test.db' } },
});

// Fecha fija: lunes 3 de agosto de 2026 (UTC).
const TEST_DATE = '2026-08-03';

async function seedTestVenue() {
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.availabilityRule.deleteMany();
  await prisma.venue.deleteMany();

  const venue = await prisma.venue.create({
    data: {
      name: 'Test Gym',
      slug: 'test-gym',
      industry: 'gym',
      services: {
        create: [{ name: 'Clase', durationMin: 60, capacity: 10 }],
      },
      rules: {
        create: [{ dayOfWeek: 1, startTime: '09:00', endTime: '12:00' }],
      },
    },
    include: { services: true },
  });

  return venue;
}

describe('slot generation', () => {
  it('generates slots for a service on an open day', async () => {
    const venue = await seedTestVenue();
    const service = venue.services[0];

    const slots = await generateSlots(service.id, TEST_DATE, prisma);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0].available).toBe(true);
  });

  it('marks booked slot as unavailable', async () => {
    const venue = await seedTestVenue();
    const service = venue.services[0];

    const slots = await generateSlots(service.id, TEST_DATE, prisma);
    const slot = slots.find((s) => s.available);
    expect(slot).toBeDefined();

    await bookSlot(service.id, new Date(slot!.startAt), 'Manuel', undefined, undefined, undefined, prisma);

    const slotsAfter = await generateSlots(service.id, TEST_DATE, prisma);
    const booked = slotsAfter.find(
      (s) => new Date(s.startAt).getTime() === new Date(slot!.startAt).getTime(),
    );
    expect(booked?.available).toBe(false);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
