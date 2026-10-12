import { PrismaMariaDb } from "@prisma/adapter-mariadb";

export function createPrismaAdapter() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to create the Prisma MySQL adapter.");
  }

  const url = new URL(databaseUrl);

  if (url.protocol !== "mysql:") {
    throw new Error("DATABASE_URL must use the mysql:// protocol.");
  }

  const database = url.pathname.slice(1);

  if (!database) {
    throw new Error("DATABASE_URL must include a database name.");
  }

  return new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(database),
    connectionLimit: 5,
  });
}
