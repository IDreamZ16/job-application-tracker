module.exports = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Validation errors from express-validator module
  if (err.type === 'validation') {
    return res.status(400).json({ error: err.message });
  }

  // PostgreSQL unique constraint violation handles duplicates for example emails
  if (err.code === '23505') {
    return res.status(409).json({ error: 'A record with that value already exists' });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced record does not exist' });
  }

  // Default to 500
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error';

  res.status(statusCode).json({ error: message });
};