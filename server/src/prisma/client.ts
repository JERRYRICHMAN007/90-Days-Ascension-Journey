import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL?.trim()) {
    return null;
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/** Lazy proxy — safe when DATABASE_URL is missing (local dev auth only) */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    if (!client) {
      throw new Error(
        'Database is not configured. Set DATABASE_URL in server/.env for DB features. Auth still works via local dev mode.'
      );
    }
    return (client as any)[prop];
  },
});

export default prisma;
