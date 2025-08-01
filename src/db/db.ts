import { PrismaClient } from '@prisma/client';
import { env } from '../env.ts';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
