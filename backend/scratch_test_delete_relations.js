import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("Checking user_1...");
    const user = await prisma.user.findUnique({
      where: { id: "user_1" },
      include: {
        workspaces: true,
        ownedWorkspaces: true,
      }
    });
    console.log("Found user:", user);

    if (user) {
      console.log("Attempting to delete user_1 to see relation cascades...");
      // Wrap in a transaction to roll back so we don't destroy active demo data!
      const result = await prisma.$transaction(async (tx) => {
        const deleted = await tx.user.delete({
          where: { id: "user_1" }
        });
        console.log("Deleted user successfully in transaction:", deleted);
        throw new Error("ROLLBACK_FOR_TEST"); // Force rollback so we don't actually delete it!
      });
    }
  } catch (err) {
    if (err.message === "ROLLBACK_FOR_TEST") {
      console.log("Transaction successfully rolled back! No data was permanently deleted.");
    } else {
      console.error("Caught real error during relation delete test:", err);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
