require("./setup");
const request = require("supertest");
const app = require("../src/app");
const { pool } = require("./setup");
const {
  createAuthedUser,
  buildJob,
  createJob,
} = require("./helpers/factories");

describe("Jobs Routes", () => {
  // ─────────────────────────────────────────────
  // GET /api/jobs
  // ─────────────────────────────────────────────
  describe("GET /api/jobs", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app).get("/api/jobs");
      expect(res.statusCode).toBe(401);
    });

    it("returns an empty array when user has no jobs", async () => {
      const { token } = await createAuthedUser();
      const res = await request(app)
        .get("/api/jobs")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.jobs).toEqual([]);
    });

    it("returns only the authenticated user's jobs", async () => {
      const { token: tokenA } = await createAuthedUser();
      const { token: tokenB } = await createAuthedUser();

      await createJob(tokenA, { company: "Company A1" });
      await createJob(tokenA, { company: "Company A2" });
      await createJob(tokenB, { company: "Company B1" });

      const res = await request(app)
        .get("/api/jobs")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.jobs).toHaveLength(2);
      res.body.jobs.forEach((job) => expect(job.company).toMatch(/^Company A/));
    });
  });

  // ─────────────────────────────────────────────
  // POST /api/jobs
  // ─────────────────────────────────────────────
  describe("POST /api/jobs", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app).post("/api/jobs").send(buildJob());
      expect(res.statusCode).toBe(401);
    });

    it("returns 400 if company is missing", async () => {
      const { token } = await createAuthedUser();
      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send({ position: "Engineer" });
      expect(res.statusCode).toBe(400);
    });

    it("returns 400 if position is missing", async () => {
      const { token } = await createAuthedUser();
      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send({ company: "Acme Corp" });
      expect(res.statusCode).toBe(400);
    });

    it("creates a job with required fields and returns it", async () => {
      const { token } = await createAuthedUser();
      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send(buildJob());

      expect(res.statusCode).toBe(201);
      expect(res.body.job).toMatchObject({
        company: "Acme Corp",
        position: "Software Engineer",
        status: "applied",
      });
      expect(res.body.job.id).toBeDefined();
      // User ID must never be leaked in a way that allows spoofing
      expect(res.body.job.user_id).toBeDefined();
    });

    it("creates a job with all optional fields", async () => {
      const { token } = await createAuthedUser();
      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send(
          buildJob({
            location: "Vancouver, BC",
            salary_min: 80000,
            salary_max: 100000,
            job_type: "remote",
            job_url: "https://example.com/job",
            notes: "Great opportunity",
            description: "Full stack role",
            applied_date: "2025-01-15",
          }),
        );

      expect(res.statusCode).toBe(201);
      expect(res.body.job).toMatchObject({
        location: "Vancouver, BC",
        salary_min: 80000,
        salary_max: 100000,
        job_type: "remote",
      });
    });
  });

  // ─────────────────────────────────────────────
  // GET /api/jobs/:id
  // ─────────────────────────────────────────────
  describe("GET /api/jobs/:id", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app).get("/api/jobs/1");
      expect(res.statusCode).toBe(401);
    });

    it("returns 404 for a non-existent job", async () => {
      const { token } = await createAuthedUser();
      const res = await request(app)
        .get("/api/jobs/99999")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });

    it("returns 404 when accessing another user's job", async () => {
      const { token: tokenA } = await createAuthedUser();
      const { token: tokenB } = await createAuthedUser();
      const job = await createJob(tokenA);

      const res = await request(app)
        .get(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${tokenB}`);

      // Must be 404 not 403 — never confirm the resource exists
      expect(res.statusCode).toBe(404);
    });

    it("returns the correct job for its owner", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token, { company: "Target Corp" });

      const res = await request(app)
        .get(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.job).toMatchObject({
        id: job.id,
        company: "Target Corp",
      });
    });
  });

  // ─────────────────────────────────────────────
  // PUT /api/jobs/:id
  // ─────────────────────────────────────────────
  describe("PUT /api/jobs/:id", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app).put("/api/jobs/1").send(buildJob());
      expect(res.statusCode).toBe(401);
    });

    it("returns 404 when updating another user's job", async () => {
      const { token: tokenA } = await createAuthedUser();
      const { token: tokenB } = await createAuthedUser();
      const job = await createJob(tokenA);

      const res = await request(app)
        .put(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send(buildJob({ company: "Hacked Corp" }));

      expect(res.statusCode).toBe(404);
    });

    it("updates the job and returns the updated record", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token, { status: "saved" });

      const res = await request(app)
        .put(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(
          buildJob({
            company: "Updated Corp",
            position: "Senior Engineer",
            status: "interviewing",
          }),
        );

      expect(res.statusCode).toBe(200);
      expect(res.body.job).toMatchObject({
        company: "Updated Corp",
        position: "Senior Engineer",
        status: "interviewing",
      });
    });
  });

  // ─────────────────────────────────────────────
  // DELETE /api/jobs/:id
  // ─────────────────────────────────────────────
  describe("DELETE /api/jobs/:id", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app).delete("/api/jobs/1");
      expect(res.statusCode).toBe(401);
    });

    it("returns 404 when deleting another user's job", async () => {
      const { token: tokenA } = await createAuthedUser();
      const { token: tokenB } = await createAuthedUser();
      const job = await createJob(tokenA);

      const res = await request(app)
        .delete(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.statusCode).toBe(404);
    });

    it("deletes the job and confirms it is gone", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);

      const deleteRes = await request(app)
        .delete(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(deleteRes.statusCode).toBe(200);
      expect(deleteRes.body.message).toBe("Job deleted successfully");

      const getRes = await request(app)
        .get(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(getRes.statusCode).toBe(404);
    });

    it("cascade deletes associated contacts and activities", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);

      // Attach a contact and an activity to the job
      await request(app)
        .post(`/api/jobs/${job.id}/contacts`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Jane Recruiter", role: "Recruiter" });

      await request(app)
        .post(`/api/jobs/${job.id}/activities`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "applied",
          title: "Applied online",
          activity_date: "2025-01-15",
        });

      // Delete the job
      await request(app)
        .delete(`/api/jobs/${job.id}`)
        .set("Authorization", `Bearer ${token}`);

      // Query the database directly to confirm cascade worked
      const contacts = await pool.query(
        "SELECT * FROM contacts WHERE job_id = $1",
        [job.id],
      );
      const activities = await pool.query(
        "SELECT * FROM activities WHERE job_id = $1",
        [job.id],
      );

      expect(contacts.rows).toHaveLength(0);
      expect(activities.rows).toHaveLength(0);
    });
  });
});
