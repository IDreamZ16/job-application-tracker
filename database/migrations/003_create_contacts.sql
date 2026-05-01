CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  email VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  linkedin_url TEXT DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_contacts_job
    FOREIGN KEY (job_id)
    REFERENCES jobs(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_contacts_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);