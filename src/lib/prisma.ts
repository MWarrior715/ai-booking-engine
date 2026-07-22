import { PrismaClient } from '@prisma/client';
import { seedDatabase } from './db-seed';

/**
 * Cliente Prisma único para toda la aplicación. En la primera request fría
 * siembra datos si la tabla Venue está vacía. La siembra es idempotente.
 */
export const prisma = new PrismaClient();

let seeding: Promise<void> | null = null;

export async function ensureSeed(): Promise<void> {
  if (seeding) return seeding;
  seeding = (async () => {
    try {
      const count = await prisma.venue.count();
      if (count === 0) {
        await seedDatabase(prisma);
      }
    } catch (error) {
      console.error('[ensureSeed] failed:', error);
      // No lanzamos el error para no romper la request; el log ayudará a debuggear.
    }
  })();
  return seeding;
}
