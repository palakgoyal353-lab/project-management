import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const workspaces = await prisma.workspace.findMany();
    console.log(`Found ${workspaces.length} workspaces. Checking memberships...`);

    let createdCount = 0;
    for (const ws of workspaces) {
      // Find or create workspace member record for the owner
      const existing = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: ws.ownerId,
            workspaceId: ws.id,
          },
        },
      });

      if (!existing) {
        await prisma.workspaceMember.create({
          data: {
            userId: ws.ownerId,
            workspaceId: ws.id,
            role: 'ADMIN',
          },
        });
        console.log(`Added owner ${ws.ownerId} as ADMIN member to workspace ${ws.name} (${ws.id})`);
        createdCount++;
      } else {
        console.log(`Owner ${ws.ownerId} is already a member of workspace ${ws.name} (${ws.id})`);
      }
    }
    console.log(`Successfully verified memberships. Created ${createdCount} new member records.`);
  } catch (err) {
    console.error('Error fixing memberships:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
