require("./setup");
const request = require("supertest");
const app = require("../src/app");
const {
  buildUser,
  registerUser,
  createAuthedUser,
} = require("./helpers/factories");

describe("Auth Routes", () => {
  // ─────────────────────────────────────────────
  // POST /api/auth/register
  // ─────────────────────────────────────────────
  describe("POST /api/auth/register", () => {
    // Validation tests
    it("returns 400 if name is missing", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "test@example.com", password: "password123" });
      expect(res.statusCode).toBe(400);
    });

    it("returns 400 if email is invalid", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test", email: "notanemail", password: "password123" });
      expect(res.statusCode).toBe(400);
    });

    it("returns 400 if password is too short", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test", email: "test@example.com", password: "123" });
      expect(res.statusCode).toBe(400);
    });

    // Database-backed tests
    it("creates a user with valid input and returns a token", async () => {
      const user = buildUser();
      const res = await request(app).post("/api/auth/register").send(user);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(typeof res.body.token).toBe("string");
      expect(res.body.user).toMatchObject({
        name: user.name,
        email: user.email,
      });
      // Password must never come back in the response
      expect(res.body.user).not.toHaveProperty("password");
      expect(res.body.user).not.toHaveProperty("password_hash");
    });

    it("rejects duplicate email registrations", async () => {
      const { user } = await registerUser();
      const res = await request(app).post("/api/auth/register").send(user);

      expect(res.statusCode).toBeGreaterThanOrEqual(400);
      expect(res.statusCode).toBeLessThan(500);
    });
  });

  // ─────────────────────────────────────────────
  // POST /api/auth/login
  // ─────────────────────────────────────────────
  describe("POST /api/auth/login", () => {
    it("returns 400 if email is missing", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ password: "password123" });
      expect(res.statusCode).toBe(400);
    });

    it("returns a token for valid credentials", async () => {
      const { user } = await registerUser();
      const res = await request(app).post("/api/auth/login").send({
        email: user.email,
        password: user.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toMatchObject({ email: user.email });
    });

    it("rejects an unknown email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nobody@example.com",
        password: "password123",
      });
      expect(res.statusCode).toBe(401);
    });

    it("rejects a wrong password", async () => {
      const { user } = await registerUser();
      const res = await request(app).post("/api/auth/login").send({
        email: user.email,
        password: "wrongpassword",
      });
      expect(res.statusCode).toBe(401);
    });
  });

  // ─────────────────────────────────────────────
  // GET /api/auth/me
  // ─────────────────────────────────────────────
  describe("GET /api/auth/me", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.statusCode).toBe(401);
    });

    it("returns 401 with a malformed token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer not-a-real-token");
      expect(res.statusCode).toBe(401);
    });

    it("returns the current user with a valid token", async () => {
      const { user, token } = await createAuthedUser();
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toMatchObject({
        name: user.name,
        email: user.email,
      });
      expect(res.body.user).not.toHaveProperty("password_hash");
    });
  });
});
