import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../src/lib/db-seed';

const prisma = new PrismaClient();

async function main() {
  await seedDatabase(prisma);
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
