require("./setup");
const request = require("supertest");
const app = require("../src/app");
const {
  createAuthedUser,
  createJob,
  buildContact,
  createContact,
} = require("./helpers/factories");

describe("Contacts Routes", () => {
  // ─────────────────────────────────────────────
  // GET /api/jobs/:jobId/contacts
  // ─────────────────────────────────────────────
  describe("GET /api/jobs/:jobId/contacts", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app).get("/api/jobs/1/contacts");
      expect(res.statusCode).toBe(401);
    });

    it("returns an empty array when the job has no contacts", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);

      const res = await request(app)
        .get(`/api/jobs/${job.id}/contacts`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.contacts).toEqual([]);
    });

    it("returns only contacts belonging to the authenticated user", async () => {
      const { token: tokenA } = await createAuthedUser();
      const { token: tokenB } = await createAuthedUser();
      const jobA = await createJob(tokenA);
      const jobB = await createJob(tokenB);

      // User A adds two contacts to their job
      await createContact(tokenA, jobA.id, { name: "Alice" });
      await createContact(tokenA, jobA.id, { name: "Bob" });

      // User B adds one contact to their own job
      await createContact(tokenB, jobB.id, { name: "Carol" });

      const res = await request(app)
        .get(`/api/jobs/${jobA.id}/contacts`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.contacts).toHaveLength(2);
      const names = res.body.contacts.map((c) => c.name);
      expect(names).toContain("Alice");
      expect(names).toContain("Bob");
    });
  });

  // ─────────────────────────────────────────────
  // POST /api/jobs/:jobId/contacts
  // ─────────────────────────────────────────────
  describe("POST /api/jobs/:jobId/contacts", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app)
        .post("/api/jobs/1/contacts")
        .send(buildContact());
      expect(res.statusCode).toBe(401);
    });

    it("returns 400 if name is missing", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);

      const res = await request(app)
        .post(`/api/jobs/${job.id}/contacts`)
        .set("Authorization", `Bearer ${token}`)
        .send({ role: "Recruiter" });

      expect(res.statusCode).toBe(400);
    });

    it("creates a contact with required fields only", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);

      const res = await request(app)
        .post(`/api/jobs/${job.id}/contacts`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Jane Recruiter" });

      expect(res.statusCode).toBe(201);
      expect(res.body.contact).toMatchObject({
        name: "Jane Recruiter",
        job_id: job.id,
      });
      expect(res.body.contact.id).toBeDefined();
    });

    it("creates a contact with all optional fields", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);

      const res = await request(app)
        .post(`/api/jobs/${job.id}/contacts`)
        .set("Authorization", `Bearer ${token}`)
        .send(
          buildContact({
            email: "jane@company.com",
            phone: "555-1234",
            linkedin_url: "https://linkedin.com/in/jane",
            notes: "Met at a meetup",
          }),
        );

      expect(res.statusCode).toBe(201);
      expect(res.body.contact).toMatchObject({
        email: "jane@company.com",
        phone: "555-1234",
        linkedin_url: "https://linkedin.com/in/jane",
      });
    });
  });

  // ─────────────────────────────────────────────
  // PUT /api/jobs/:jobId/contacts/:id
  // ─────────────────────────────────────────────
  describe("PUT /api/jobs/:jobId/contacts/:id", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app)
        .put("/api/jobs/1/contacts/1")
        .send(buildContact());
      expect(res.statusCode).toBe(401);
    });

    it("returns 404 when updating another user's contact", async () => {
      const { token: tokenA } = await createAuthedUser();
      const { token: tokenB } = await createAuthedUser();
      const job = await createJob(tokenA);
      const contact = await createContact(tokenA, job.id);

      const res = await request(app)
        .put(`/api/jobs/${job.id}/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send(buildContact({ name: "Hacked Name" }));

      // Must be 404 not 403 — never confirm the resource exists
      expect(res.statusCode).toBe(404);
    });

    it("updates the contact and returns the updated record", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);
      const contact = await createContact(token, job.id, { name: "Old Name" });

      const res = await request(app)
        .put(`/api/jobs/${job.id}/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(buildContact({ name: "New Name", role: "Hiring Manager" }));

      expect(res.statusCode).toBe(200);
      expect(res.body.contact).toMatchObject({
        name: "New Name",
        role: "Hiring Manager",
      });
    });
  });

  // ─────────────────────────────────────────────
  // DELETE /api/jobs/:jobId/contacts/:id
  // ─────────────────────────────────────────────
  describe("DELETE /api/jobs/:jobId/contacts/:id", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app).delete("/api/jobs/1/contacts/1");
      expect(res.statusCode).toBe(401);
    });

    it("returns 404 when deleting another user's contact", async () => {
      const { token: tokenA } = await createAuthedUser();
      const { token: tokenB } = await createAuthedUser();
      const job = await createJob(tokenA);
      const contact = await createContact(tokenA, job.id);

      const res = await request(app)
        .delete(`/api/jobs/${job.id}/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.statusCode).toBe(404);
    });

    it("deletes the contact and confirms it is gone", async () => {
      const { token } = await createAuthedUser();
      const job = await createJob(token);
      const contact = await createContact(token, job.id);

      const deleteRes = await request(app)
        .delete(`/api/jobs/${job.id}/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(deleteRes.statusCode).toBe(200);
      expect(deleteRes.body.message).toBe("Contact deleted successfully");

      // Confirm deletion by checking the list no longer contains this contact
      const listRes = await request(app)
        .get(`/api/jobs/${job.id}/contacts`)
        .set("Authorization", `Bearer ${token}`);

      const ids = listRes.body.contacts.map((c) => c.id);
      expect(ids).not.toContain(contact.id);
    });
  });
});
