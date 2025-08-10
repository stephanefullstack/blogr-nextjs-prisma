// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// évite les erreurs de typage TS sur globalThis
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // super utile pour voir ce qui se passe dans Vercel → Runtime Logs
    log: ['query', 'info', 'warn', 'error'],
  });

// en dev on garde une instance unique entre hot reloads
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
