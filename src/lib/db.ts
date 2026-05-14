import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

const defaultLocalUrl =
  "postgresql://postgres:postgres@127.0.0.1:5432/dirotgz?schema=public";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    if (url.startsWith("file:")) {
      throw new Error(
        "DATABASE_URL משתמש ב-SQLite (file:). הפרויקט עבר ל-PostgreSQL. הריצו Docker: npm run db:up והשתמשו בכתובת מקומית או ב-Neon.",
      );
    }
    return url;
  }
  return defaultLocalUrl;
}

function getPool(): Pool {
  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = new Pool({ connectionString: getDatabaseUrl() });
  }
  return globalForPrisma.pgPool;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(getPool()),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
