import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpia datos previos.
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.availabilityRule.deleteMany();
  await prisma.venue.deleteMany();

  // 1. Restaurante
  const restaurant = await prisma.venue.create({
    data: {
      name: 'Ristorante Demo',
      slug: 'ristorante-demo',
      industry: 'restaurant',
      description: 'Reservas de mesas para almuerzo y cena.',
      services: {
        create: [
          { name: 'Mesa almuerzo', durationMin: 90, capacity: 4 },
          { name: 'Mesa cena', durationMin: 120, capacity: 2 },
        ],
      },
      rules: {
        create: [
          { dayOfWeek: 1, startTime: '12:00', endTime: '15:00' },
          { dayOfWeek: 1, startTime: '19:00', endTime: '22:00' },
          { dayOfWeek: 5, startTime: '19:00', endTime: '23:00' },
          { dayOfWeek: 6, startTime: '12:00', endTime: '23:00' },
        ],
      },
    },
    include: { services: true },
  });

  // 2. Gimnasio
  const gym = await prisma.venue.create({
    data: {
      name: 'Gym Warrior',
      slug: 'gym-warrior',
      industry: 'gym',
      description: 'Reservas de clases y máquinas.',
      services: {
        create: [
          { name: 'Clase spinning', durationMin: 60, capacity: 20 },
          { name: 'Personal training', durationMin: 60, capacity: 1 },
        ],
      },
      rules: {
        create: [
          { dayOfWeek: 1, startTime: '06:00', endTime: '21:00' },
          { dayOfWeek: 3, startTime: '06:00', endTime: '21:00' },
          { dayOfWeek: 5, startTime: '06:00', endTime: '21:00' },
        ],
      },
    },
    include: { services: true },
  });

  // 3. Spa
  const spa = await prisma.venue.create({
    data: {
      name: 'Spa Relax',
      slug: 'spa-relax',
      industry: 'spa',
      description: 'Reservas de masajes y tratamientos.',
      services: {
        create: [
          { name: 'Masaje relajante', durationMin: 60, capacity: 1 },
          { name: 'Facial', durationMin: 45, capacity: 1 },
        ],
      },
      rules: {
        create: [
          { dayOfWeek: 2, startTime: '10:00', endTime: '18:00' },
          { dayOfWeek: 4, startTime: '10:00', endTime: '18:00' },
          { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
        ],
      },
    },
    include: { services: true },
  });

  // 4. Salón de belleza
  const salon = await prisma.venue.create({
    data: {
      name: 'Salón Belleza',
      slug: 'salon-belleza',
      industry: 'salon',
      description: 'Citas de corte, color y manicure.',
      services: {
        create: [
          { name: 'Corte de cabello', durationMin: 45, capacity: 1 },
          { name: 'Manicure', durationMin: 30, capacity: 1 },
        ],
      },
      rules: {
        create: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
          { dayOfWeek: 6, startTime: '09:00', endTime: '14:00' },
        ],
      },
    },
    include: { services: true },
  });

  // 5. Consultorio
  const clinic = await prisma.venue.create({
    data: {
      name: 'Consultorio Médico',
      slug: 'consultorio-medico',
      industry: 'clinic',
      description: 'Agendamiento de citas médicas.',
      services: {
        create: [
          { name: 'Consulta general', durationMin: 30, capacity: 1 },
          { name: 'Consulta especialista', durationMin: 45, capacity: 1 },
        ],
      },
      rules: {
        create: [
          { dayOfWeek: 1, startTime: '08:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '08:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '08:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '08:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '08:00', endTime: '14:00' },
        ],
      },
    },
    include: { services: true },
  });

  // 6. Coworking
  const coworking = await prisma.venue.create({
    data: {
      name: 'Coworking Hub',
      slug: 'coworking-hub',
      industry: 'coworking',
      description: 'Reservas de salas de reuniones y escritorios.',
      services: {
        create: [
          { name: 'Sala de reuniones A', durationMin: 60, capacity: 8 },
          { name: 'Escritorio flexible', durationMin: 240, capacity: 1 },
        ],
      },
      rules: {
        create: [
          { dayOfWeek: 1, startTime: '08:00', endTime: '20:00' },
          { dayOfWeek: 2, startTime: '08:00', endTime: '20:00' },
          { dayOfWeek: 3, startTime: '08:00', endTime: '20:00' },
          { dayOfWeek: 4, startTime: '08:00', endTime: '20:00' },
          { dayOfWeek: 5, startTime: '08:00', endTime: '20:00' },
        ],
      },
    },
    include: { services: true },
  });

  console.log('Seeded venues:', [
    restaurant.slug,
    gym.slug,
    spa.slug,
    salon.slug,
    clinic.slug,
    coworking.slug,
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
