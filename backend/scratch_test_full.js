import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Found users:", users.length);
    const ws = await prisma.workspace.findMany();
    console.log("Found workspaces:", ws.length);
  } catch (e) {
    console.error("Query error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
