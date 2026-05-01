-- Updates "updated_at" column everytime there is a change in the tables.

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_jobs_timestamp
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_contacts_timestamp
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_activities_timestamp
  BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();