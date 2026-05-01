const db = require('../config/database');

const findAllByUser = async (userId) => {
  const result = await db.query(
    `SELECT * FROM jobs WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

const findById = async (id, userId) => {
  const result = await db.query(
    `SELECT * FROM jobs WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return result.rows[0];
};

const create = async ({ user_id, company, position, status, job_url, salary_min, salary_max, location, job_type, description, notes, applied_date }) => {
  const result = await db.query(
    `INSERT INTO jobs 
      (user_id, company, position, status, job_url, salary_min, salary_max, location, job_type, description, notes, applied_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [user_id, company, position, status, job_url, salary_min, salary_max, location, job_type, description, notes, applied_date]
  );
  return result.rows[0];
};

const remove = async (id, userId) => {
  const result = await db.query(
    `DELETE FROM jobs WHERE id = $1 AND user_id = $2 RETURNING id`,
    [id, userId]
  );
  return result.rows[0];
};

const update = async (id, userId, fields) => {
  const { company, position, status, job_url, salary_min, salary_max, location, job_type, description, notes, applied_date } = fields;
  const result = await db.query(
    `UPDATE jobs SET
      company = $1, position = $2, status = $3, job_url = $4,
      salary_min = $5, salary_max = $6, location = $7, job_type = $8,
      description = $9, notes = $10, applied_date = $11
     WHERE id = $12 AND user_id = $13
     RETURNING *`,
    [company, position, status, job_url, salary_min, salary_max, location, job_type, description, notes, applied_date, id, userId]
  );
  return result.rows[0];
};


module.exports = { findAllByUser, findById, create, update, remove };