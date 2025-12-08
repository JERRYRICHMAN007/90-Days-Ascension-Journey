import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: await hashPassword('Test1234!'),
      emailVerified: true,
    },
  });

  console.log('✅ Created test user:', testUser.email);

  // Create sample domain progress
  const domains = [
    { domainId: 'body-transformation', name: 'Body Transformation' },
    { domainId: 'dual-brand', name: 'Dual Brand' },
    { domainId: 'reading', name: 'Reading Journey' },
    { domainId: 'writers', name: "Writer's Journey" },
    { domainId: 'software-engineering', name: 'Software Engineering' },
  ];

  for (const domain of domains) {
    await prisma.domain.upsert({
      where: {
        userId_domainId: {
          userId: testUser.id,
          domainId: domain.domainId,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        domainId: domain.domainId,
        name: domain.name,
        totalDays: 90,
        completedDays: 0,
        progress: 0,
      },
    });
  }

  console.log('✅ Created sample domains');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

