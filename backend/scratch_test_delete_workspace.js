import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("Creating dummy workspace...");
    const ws = await prisma.workspace.create({
      data: {
        id: "dummy_ws_999",
        name: "Delete Test WS",
        slug: "delete-test-ws",
        ownerId: "user_1",
      }
    });
    console.log("Created WS:", ws);

    console.log("Attempting to delete workspace...");
    const deleted = await prisma.workspace.delete({
      where: { id: "dummy_ws_999" }
    });
    console.log("Deleted WS successfully:", deleted);
  } catch (err) {
    console.error("Caught error during workspace delete test:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
