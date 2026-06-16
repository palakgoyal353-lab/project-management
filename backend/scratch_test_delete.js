import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("Creating dummy user...");
    const user = await prisma.user.create({
      data: {
        id: "dummy_user_id_999",
        name: "Dummy Delete Test",
        email: "dummy_delete@example.com",
      }
    });
    console.log("Created successfully:", user);

    console.log("Attempting to delete dummy user...");
    const deleted = await prisma.user.delete({
      where: { id: "dummy_user_id_999" }
    });
    console.log("Deleted successfully:", deleted);
  } catch (err) {
    console.error("Caught error during test:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
