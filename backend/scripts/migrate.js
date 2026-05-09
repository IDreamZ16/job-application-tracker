const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

// When invoked directly (not from tests), load .env
if (require.main === module && !process.env.DATABASE_URL) {
  require("dotenv").config();
}

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
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
    .filter((f) => !f.startsWith("000_")) // 000_ reserved for Docker init scripts
    .sort();

  // Mask password in log output
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
