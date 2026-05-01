-- Demo user (password: "password123" - hashed at app level, this is a placeholder)
INSERT INTO users (name, email, password_hash, created_at, updated_at) VALUES
  ('Alex Dev', 'alex@example.com', 'placeholder_hash', NOW(), NOW());

-- Demo jobs
INSERT INTO jobs (user_id, company, position, status, location, job_type, applied_date, created_at, updated_at) VALUES
  (1, 'Shopify', 'Junior Software Engineer', 'interviewing', 'Vancouver, BC', 'hybrid', NOW(), NOW(), NOW()),
  (1, 'Jobber', 'Intermediate Developer', 'applied', 'Edmonton, AB', 'remote', NOW(), NOW(), NOW()),
  (1, 'Hootsuite', 'Full Stack Developer', 'saved', 'Vancouver, BC', 'onsite', NULL, NOW(), NOW()),
  (1, 'Stantec', 'Software Developer', 'rejected', 'Edmonton, AB', 'hybrid', NOW(), NOW(), NOW());

-- Demo contacts
INSERT INTO contacts (job_id, user_id, name, role, email, phone, linkedin_url, notes, created_at, updated_at) VALUES
  (1, 1, 'Sarah Chen', 'Recruiter', 'sarah.chen@shopify.com', '604-555-0101', 'https://linkedin.com/in/sarahchen', NULL, NOW(), NOW()),
  (2, 1, 'Mark Rivera', 'Hiring Manager', NULL, NULL, 'https://linkedin.com/in/markrivera', 'Prefers Teams meetings', NOW(), NOW());

-- Demo activities
INSERT INTO activities (job_id, user_id, type, title, description, activity_date, created_at, updated_at) VALUES
  (1, 1, 'applied', 'Submitted application', 'Applied via Shopify careers page', NOW(), NOW(), NOW()),
  (1, 1, 'phone_screen', 'Recruiter call with Sarah', 'Discussed role expectations and salary range', NOW(), NOW(), NOW()),
  (2, 1, 'applied', 'Submitted application via LinkedIn', NULL, NOW(), NOW(), NOW());