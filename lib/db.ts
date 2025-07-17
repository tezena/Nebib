// db.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:URazqrynAMopMcJVLtiWzDhikLOlsMqd@mainline.proxy.rlwy.net:15858/railway",
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
