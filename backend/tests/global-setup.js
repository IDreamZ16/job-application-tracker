const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env.test") });

const { Pool } = require("pg");
const { runMigrations } = require("../scripts/migrate");

module.exports = async () => {
  // Never run global setup against the dev database
  if (!process.env.DATABASE_URL?.includes("_test")) {
    throw new Error(
      "Refusing to run global-setup: DATABASE_URL does not appear to be a test database. " +
        'Expected something containing "_test", got: ' +
        process.env.DATABASE_URL,
    );
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Wipe schema for a clean migration run
    await pool.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  } finally {
    await pool.end();
  }

  // Re-create tables, triggers, etc.
  await runMigrations();
};
