CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  type VARCHAR(50) CHECK (
    type IN ('applied', 'email', 'phone_screen', 'interview', 'offer', 'rejected', 'note')
  ),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  activity_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_activities_job
    FOREIGN KEY (job_id)
    REFERENCES jobs(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_activities_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);