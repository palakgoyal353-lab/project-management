import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
try {
  const adapter = new PrismaBetterSqlite3({
    url: 'file:./prisma/dev.db',
  });
  console.log("Instance created:", adapter);
} catch (err) {
  console.error("Caught Error:", err);
}
