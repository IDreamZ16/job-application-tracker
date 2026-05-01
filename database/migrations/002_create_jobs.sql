CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'saved' CHECK (
    status IN ('saved', 'applied', 'interviewing', 'offer', 'rejected')
  ),
  job_url TEXT,
  salary_min INTEGER DEFAULT NULL,
  salary_max INTEGER DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  job_type VARCHAR(50) DEFAULT NULL CHECK (
    job_type IS NULL OR job_type IN ('remote', 'hybrid', 'onsite')
  ),
  description TEXT,
  notes TEXT,
  applied_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_jobs_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);