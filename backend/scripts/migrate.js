const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

if (require.main === module && !process.env.DATABASE_URL) {
  require("dotenv").config();
}

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_URL?.includes("localhost") ||
      process.env.DATABASE_URL?.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
  });

  const migrationsDir = path.join(
    __dirname,
    "..",
    "..",
    "database",
    "migrations",
  );

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .filter((f) => !f.startsWith("000_"))
    .sort();

  const safeUrl = process.env.DATABASE_URL.replace(/:[^@/]+@/, ":***@");
  console.log(`Running ${files.length} migrations against ${safeUrl}`);

  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      console.log(`  → ${file}`);
      await pool.query(sql);
    }
    console.log("✓ Migrations complete");
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations().catch((err) => {
    console.error("✗ Migration failed:", err.message);
    process.exit(1);
  });
}

module.exports = { runMigrations };
