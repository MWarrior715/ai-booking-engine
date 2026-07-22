import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { seedDatabase } from './db-seed';

const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const isTmpDb = dbUrl.startsWith('file:/tmp/') || dbUrl.includes('/tmp/');

/**
 * Cliente Prisma único para toda la aplicación. En serverless (p. ej. Vercel)
 * la DB vive en `/tmp` y se pierde en cada cold start, así que copiamos el
 * schema sembrado en el build output y, si está vacío, sembramos datos.
 * La siembra es idempotente: solo corre cuando no hay venues.
 */
export const prisma = new PrismaClient();

let seeding: Promise<void> | null = null;

function copySchemaToTmp(): void {
  if (!isTmpDb) return;
  const src = path.resolve(process.cwd(), 'prisma/dev.db');
  const dest = '/tmp/dev.db';
  if (!fs.existsSync(dest) && fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

export async function ensureSeed(): Promise<void> {
  if (seeding) return seeding;
  seeding = (async () => {
    try {
      copySchemaToTmp();
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
