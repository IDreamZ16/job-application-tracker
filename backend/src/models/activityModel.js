const db = require('../config/database');

const findAllByJob = async (jobId, userId) => {
  const result = await db.query(
    `SELECT * FROM activities WHERE job_id = $1 AND user_id = $2 ORDER BY activity_date DESC`,
    [jobId, userId]
  );
  return result.rows;
};

const create = async ({ job_id, user_id, type, title, description, activity_date }) => {
  const result = await db.query(
    `INSERT INTO activities (job_id, user_id, type, title, description, activity_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [job_id, user_id, type, title, description, activity_date]
  );
  return result.rows[0];
};

const update = async (id, userId, fields) => {
  const { type, title, description, activity_date } = fields;
  const result = await db.query(
    `UPDATE activities SET
      type = $1, title = $2, description = $3, activity_date = $4
     WHERE id = $5 AND user_id = $6
     RETURNING *`,
    [type, title, description, activity_date, id, userId]
  );
  return result.rows[0];
};

const remove = async (id, userId) => {
  const result = await db.query(
    `DELETE FROM activities WHERE id = $1 AND user_id = $2 RETURNING id`,
    [id, userId]
  );
  return result.rows[0];
};
module.exports = { findAllByJob, create, update, remove };