import Database from 'better-sqlite3';

try {
  const db = new Database('./dev.db');
  
  // List all tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("Tables in database:", tables.map(t => t.name));

  // Count rows in User and Workspace
  for (const table of tables.map(t => t.name)) {
    if (table.startsWith('sqlite_')) continue;
    try {
      const count = db.prepare(`SELECT COUNT(*) as cnt FROM "${table}"`).get();
      console.log(`Table "${table}" has ${count.cnt} rows.`);
      if (count.cnt > 0) {
        const rows = db.prepare(`SELECT * FROM "${table}" LIMIT 3`).all();
        console.log(`Sample rows from "${table}":`, rows);
      }
    } catch (e) {
      console.error(`Error querying table ${table}:`, e.message);
    }
  }
  
  db.close();
} catch (err) {
  console.error("Direct SQLite error:", err);
}
