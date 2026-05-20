require("./setup");
const request = require("supertest");
const app = require("../src/app");
const {
  createAuthedUser,
  createJob,
  buildActivity,
  createActivity,
} = require("./helpers/factories");

describe("Activities Routes", () => {
  // ─────────────────────────────────────────────
  // GET /api/jobs/:jobId/activities
  // ─────────────────────────────────────────────
  describe("GET /api/jobs/:jobId/activities", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app).get("/api/jobs/1/activities");
      expect(res.statusCode).toBe(401);
    });

    it("returns an empty array when the job has no activities", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);

      const res = await request(app)
        .get(`/api/jobs/${job.id}/activities`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.activities).toEqual([]);
    });

    it("returns only activities belonging to the authenticated user", async () => {
      const { token: tokenA } = await createAuthedUser();
      const { token: tokenB } = await createAuthedUser();
      const jobA = await createJob(tokenA);
      const jobB = await createJob(tokenB);

      await createActivity(tokenA, jobA.id, { title: "Activity A1" });
      await createActivity(tokenA, jobA.id, { title: "Activity A2" });
      await createActivity(tokenB, jobB.id, { title: "Activity B1" });

      const res = await request(app)
        .get(`/api/jobs/${jobA.id}/activities`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.activities).toHaveLength(2);
      const titles = res.body.activities.map((a) => a.title);
      expect(titles).toContain("Activity A1");
      expect(titles).toContain("Activity A2");
    });
  });

  // ─────────────────────────────────────────────
  // POST /api/jobs/:jobId/activities
  // ─────────────────────────────────────────────
  describe("POST /api/jobs/:jobId/activities", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app)
        .post("/api/jobs/1/activities")
        .send(buildActivity());
      expect(res.statusCode).toBe(401);
    });

    it("returns 400 if title is missing", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);

      const res = await request(app)
        .post(`/api/jobs/${job.id}/activities`)
        .set("Authorization", `Bearer ${token}`)
        .send({ type: "note", activity_date: "2025-01-15" });

      expect(res.statusCode).toBe(400);
    });

    it("returns 400 if type is invalid", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);

      const res = await request(app)
        .post(`/api/jobs/${job.id}/activities`)
        .set("Authorization", `Bearer ${token}`)
        .send(buildActivity({ type: "not_a_real_type" }));

      expect(res.statusCode).toBe(400);
    });

    it("creates an activity with required fields only", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);

      const res = await request(app)
        .post(`/api/jobs/${job.id}/activities`)
        .set("Authorization", `Bearer ${token}`)
        .send(buildActivity());

      expect(res.statusCode).toBe(201);
      expect(res.body.activity).toMatchObject({
        type: "phone_screen",
        title: "Call with recruiter",
        job_id: job.id,
      });
      expect(res.body.activity.id).toBeDefined();
    });

    it("creates an activity with an optional description", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);

      const res = await request(app)
        .post(`/api/jobs/${job.id}/activities`)
        .set("Authorization", `Bearer ${token}`)
        .send(
          buildActivity({
            type: "interview",
            title: "Technical interview",
            description: "Two hours, system design and coding round",
          }),
        );

      expect(res.statusCode).toBe(201);
      expect(res.body.activity).toMatchObject({
        type: "interview",
        description: "Two hours, system design and coding round",
      });
    });
  });

  // ─────────────────────────────────────────────
  // PUT /api/jobs/:jobId/activities/:id
  // ─────────────────────────────────────────────
  describe("PUT /api/jobs/:jobId/activities/:id", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app)
        .put("/api/jobs/1/activities/1")
        .send(buildActivity());
      expect(res.statusCode).toBe(401);
    });

    it("returns 404 when updating another user's activity", async () => {
      const { token: tokenA } = await createAuthedUser();
      const { token: tokenB } = await createAuthedUser();
      const job = await createJob(tokenA);
      const activity = await createActivity(tokenA, job.id);

      const res = await request(app)
        .put(`/api/jobs/${job.id}/activities/${activity.id}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send(buildActivity({ title: "Hacked title" }));

      // Must be 404 not 403 — never confirm the resource exists
      expect(res.statusCode).toBe(404);
    });

    it("updates the activity and returns the updated record", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);
      const activity = await createActivity(token, job.id, {
        type: "note",
        title: "Old title",
      });

      const res = await request(app)
        .put(`/api/jobs/${job.id}/activities/${activity.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(
          buildActivity({
            type: "interview",
            title: "Updated title",
            description: "Added more detail after the fact",
          }),
        );

      expect(res.statusCode).toBe(200);
      expect(res.body.activity).toMatchObject({
        type: "interview",
        title: "Updated title",
        description: "Added more detail after the fact",
      });
    });
  });

  // ─────────────────────────────────────────────
  // DELETE /api/jobs/:jobId/activities/:id
  // ─────────────────────────────────────────────
  describe("DELETE /api/jobs/:jobId/activities/:id", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app).delete("/api/jobs/1/activities/1");
      expect(res.statusCode).toBe(401);
    });

    it("returns 404 when deleting another user's activity", async () => {
      const { token: tokenA } = await createAuthedUser();
      const { token: tokenB } = await createAuthedUser();
      const job = await createJob(tokenA);
      const activity = await createActivity(tokenA, job.id);

      const res = await request(app)
        .delete(`/api/jobs/${job.id}/activities/${activity.id}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.statusCode).toBe(404);
    });

    it("deletes the activity and confirms it is gone", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);
      const activity = await createActivity(token, job.id);

      const deleteRes = await request(app)
        .delete(`/api/jobs/${job.id}/activities/${activity.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(deleteRes.statusCode).toBe(200);
      expect(deleteRes.body.message).toBe("Activity deleted successfully");

      // Confirm deletion by checking the list no longer contains this activity
      const listRes = await request(app)
        .get(`/api/jobs/${job.id}/activities`)
        .set("Authorization", `Bearer ${token}`);

      const ids = listRes.body.activities.map((a) => a.id);
      expect(ids).not.toContain(activity.id);
    });
  });
});
