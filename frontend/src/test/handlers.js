import { http, HttpResponse } from "msw";

// Matches the baseURL Axios is configured with in api.js.
const BASE = "http://localhost:5000";

// Shared mock data — reused across handlers to keep responses
// consistent when tests render multiple components in sequence.
export const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
};

export const mockJob = {
  id: 1,
  company: "Acme Corp",
  position: "Software Engineer",
  status: "applied",
  location: "Vancouver, BC",
  salary_min: 80000,
  salary_max: 100000,
  job_type: "remote",
  job_url: null,
  description: null,
  notes: null,
  applied_date: "2025-01-15",
  created_at: "2025-01-15T00:00:00.000Z",
  updated_at: "2025-01-15T00:00:00.000Z",
  user_id: 1,
};

export const handlers = [
  // Auth
  http.get(`${BASE}/api/auth/me`, () => HttpResponse.json({ user: mockUser })),

  http.post(`${BASE}/api/auth/login`, () =>
    HttpResponse.json({ token: "test-token", user: mockUser }),
  ),

  http.post(`${BASE}/api/auth/register`, () =>
    HttpResponse.json({ token: "test-token", user: mockUser }, { status: 201 }),
  ),

  // Jobs
  http.get(`${BASE}/api/jobs`, () => HttpResponse.json({ jobs: [mockJob] })),

  http.post(`${BASE}/api/jobs`, () =>
    HttpResponse.json({ job: mockJob }, { status: 201 }),
  ),

  http.get(`${BASE}/api/jobs/:id`, () => HttpResponse.json({ job: mockJob })),

  http.put(`${BASE}/api/jobs/:id`, () => HttpResponse.json({ job: mockJob })),

  http.delete(`${BASE}/api/jobs/:id`, () =>
    HttpResponse.json({ message: "Job deleted successfully" }),
  ),
];
