const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

beforeEach(async () => {
  await pool.query(
    "TRUNCATE TABLE activities, contacts, jobs, users RESTART IDENTITY CASCADE",
  );
});

afterAll(async () => {
  await pool.end();
});

module.exports = { pool };
