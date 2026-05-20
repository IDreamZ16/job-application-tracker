const request = require("supertest");
const app = require("../../src/app");

// Counter ensures every generated user has a unique email address.
// Appending Date.now() adds extra uniqueness in case tests run in
// parallel or the counter resets between test files.
let userCounter = 0;

/**
 * Build a unique user payload. Each call returns a different email
 * so tests can register multiple users without collision.
 */
const buildUser = (overrides = {}) => {
  userCounter += 1;
  return {
    name: `Test User ${userCounter}`,
    email: `user${userCounter}-${Date.now()}@example.com`,
    password: "password123",
    ...overrides,
  };
};

/**
 * Register a user via the real API and return both the user payload
 * and the response. Useful when a test needs to inspect the register
 * response directly.
 */
const registerUser = async (overrides = {}) => {
  const user = buildUser(overrides);
  const res = await request(app).post("/api/auth/register").send(user);
  return { user, res };
};

/**
 * Register and log in a user, returning a ready-to-use JWT token
 * along with the user data. Most integration tests start here —
 * call this once per test to get an authenticated context.
 */
const createAuthedUser = async (overrides = {}) => {
  const { user } = await registerUser(overrides);
  const loginRes = await request(app).post("/api/auth/login").send({
    email: user.email,
    password: user.password,
  });
  return {
    user,
    token: loginRes.body.token,
    userId: loginRes.body.user?.id,
  };
};

/**
 * Build a valid job payload with sensible defaults. Pass overrides
 * to customise specific fields without repeating the full object in
 * every test. Only company, position, and status are required by the
 * API — everything else is optional and defaults to undefined.
 */
const buildJob = (overrides = {}) => ({
  company: "Acme Corp",
  position: "Software Engineer",
  status: "applied",
  ...overrides,
});

/**
 * Create a job via the real API and return the created job object.
 * Requires a valid token from createAuthedUser. Used as setup in
 * tests that need an existing job to operate on (GET, PUT, DELETE,
 * and as a parent for contacts and activities).
 */
const createJob = async (token, overrides = {}) => {
  const res = await request(app)
    .post("/api/jobs")
    .set("Authorization", `Bearer ${token}`)
    .send(buildJob(overrides));
  return res.body.job;
};

/**
 * Build a valid contact payload. Only name is required by the API —
 * all other fields are optional. jobId is passed separately to the
 * route rather than in the body.
 */
const buildContact = (overrides = {}) => ({
  name: "Jane Recruiter",
  role: "Recruiter",
  ...overrides,
});

/**
 * Create a contact via the real API under the given job and return
 * the created contact object. Requires a token and a jobId from a
 * previously created job.
 */
const createContact = async (token, jobId, overrides = {}) => {
  const res = await request(app)
    .post(`/api/jobs/${jobId}/contacts`)
    .set("Authorization", `Bearer ${token}`)
    .send(buildContact(overrides));
  return res.body.contact;
};

/**
 * Build a valid activity payload. type, title, and activity_date are
 * required by the API. type must be one of the values defined in the
 * ACTIVITY_TYPES constant and enforced by a DB CHECK constraint.
 */
const buildActivity = (overrides = {}) => ({
  type: "phone_screen",
  title: "Call with recruiter",
  activity_date: "2025-01-15",
  ...overrides,
});

/**
 * Create an activity via the real API under the given job and return
 * the created activity object. Requires a token and a jobId from a
 * previously created job.
 */
const createActivity = async (token, jobId, overrides = {}) => {
  const res = await request(app)
    .post(`/api/jobs/${jobId}/activities`)
    .set("Authorization", `Bearer ${token}`)
    .send(buildActivity(overrides));
  return res.body.activity;
};

module.exports = {
  buildUser,
  registerUser,
  createAuthedUser,
  buildJob,
  createJob,
  buildContact,
  createContact,
  buildActivity,
  createActivity,
};
