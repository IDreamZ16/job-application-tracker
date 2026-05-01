const db = require('../config/database');

const findAllByJob = async (jobId, userId) => {
  const result = await db.query(
    `SELECT * FROM contacts WHERE job_id = $1 AND user_id = $2 ORDER BY created_at DESC`,
    [jobId, userId]
  );
  return result.rows;
};

const create = async ({ job_id, user_id, name, role, email, phone, linkedin_url, notes }) => {
  const result = await db.query(
    `INSERT INTO contacts (job_id, user_id, name, role, email, phone, linkedin_url, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [job_id, user_id, name, role, email, phone, linkedin_url, notes]
  );
  return result.rows[0];
};

const update = async (id, userId, fields) => {
  const { name, role, email, phone, linkedin_url, notes } = fields;
  const result = await db.query(
    `UPDATE contacts SET
      name = $1, role = $2, email = $3, phone = $4, linkedin_url = $5, notes = $6
     WHERE id = $7 AND user_id = $8
     RETURNING *`,
    [name, role, email, phone, linkedin_url, notes, id, userId]
  );
  return result.rows[0];
};

const remove = async (id, userId) => {
  const result = await db.query(
    `DELETE FROM contacts WHERE id = $1 AND user_id = $2 RETURNING id`,
    [id, userId]
  );
  return result.rows[0];
};

module.exports = { findAllByJob, create, update, remove };