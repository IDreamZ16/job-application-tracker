# Job Application Tracker

A full-stack web app for tracking job applications, contacts, and interview activity through the hiring process. Built as a portfolio project to demonstrate end-to-end engineering: schema design, REST API development, authenticated React UI, Dockerized local development, and (coming soon) automated testing and CI/CD.

**Live demo:** <https://jobhuntmanager.vercel.app/> Note: Since a free hosting service is being used. You may need to wait about 30 seconds before the database is initialized when you try to interact with the website for the first time.

https://github.com/user-attachments/assets/a3bf8871-5ece-4f6b-aa7e-95c62262f161

## Features

- **Authentication** — JWT-based register and login with bcrypt password hashing
- **Job tracking** — Create, edit, and delete job applications with status, salary range, location, and notes; switch between grouped card view and table view
- **Job detail pages** — Full application dossier with editable fields, deletable with confirmation, and dedicated sections for contacts and activities
- **Contacts** — Track recruiters, hiring managers, and referrals per job, with one-click email, phone, and LinkedIn links
- **Activities timeline** — Log every touchpoint (phone screens, interviews, follow-ups, offers, rejections) on a chronological per-job timeline
- **Dashboard** — At-a-glance summary of applications by status, plus a focused view of jobs currently in interviewing or offer stages

## Tech Stack

**Frontend**
- React 19 with Vite for the build pipeline
- React Router for client-side routing
- TanStack Query for server-state management (caching, invalidation, background refetching)
- Axios with request/response interceptors for JWT handling
- Tailwind CSS with a custom dark theme; Syne and DM Sans for typography
- Lucide React for icons

**Backend**
- Node.js with Express
- PostgreSQL with raw `pg` queries (no ORM)
- JWT for authentication, bcrypt for password hashing
- express-validator for request validation

**Infrastructure**
- Docker Compose for local development (Postgres, backend, frontend)
- Versioned SQL migrations
- Vercel (frontend) and Render (backend + database) for production *(setup in progress)*

## Architecture

The frontend is a single-page application that talks to the backend via a REST API. Authentication is stateless — JWTs are stored in `localStorage` and attached to every request via an Axios interceptor; a 401 response triggers a redirect to the login screen.

The backend is a thin Express layer over a PostgreSQL schema with foreign-key relationships across users, jobs, contacts, and activities. All multi-tenant queries enforce ownership at the SQL level (`WHERE user_id = $1`), so a user can never read or modify another user's data even if their JWT is leaked or spoofed for a different account.

The database schema is managed through versioned SQL migration files and applied automatically on first Docker volume initialization. Updated-at timestamps are maintained by a Postgres trigger function rather than application code.

## Project Structure

```
job-application-tracker/
├── backend/              Node/Express API
│   ├── scripts/          Migration runner and other CLI utilities
│   ├── src/
│   │   ├── config/       Database pool
│   │   ├── controllers/  Route handlers
│   │   ├── middleware/   Auth and validation
│   │   ├── models/       Data access layer
│   │   └── routes/       Route definitions
│   └── tests/            Integration test suite
├── database/
│   ├── migrations/       Versioned SQL migrations
│   └── seeds/            Seed data (optional)
├── frontend/             React + Vite SPA
│   └── src/
│       ├── components/   UI components, organized by feature
│       ├── pages/        Top-level route components
│       ├── services/     API client modules
│       ├── store/        Auth context provider
│       └── utils/        Constants and formatters
├── docker-compose.yml    Local development stack
└── README.md
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ and npm (only needed if you want to run tests or the frontend dev server outside Docker)

### Setup

Clone the repo and create a `.env` file at the project root with your Postgres credentials:

```bash
cp .env.example .env
```

Then create a backend env file:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set `JWT_SECRET` to something random.

### Running the Stack

Bring everything up:

```bash
docker compose up -d
```

This starts three containers: `job_tracker_db` (Postgres on `:5432`), `job_tracker_backend` (Express on `:5000`), and `job_tracker_frontend` (Vite dev server on `:3000`). Migrations run automatically on first start.

Once the containers are healthy:

- Frontend: http://localhost:3000
- Backend health check: http://localhost:5000/health

To tail logs:

```bash
docker compose logs -f
```

To bring everything down:

```bash
docker compose down
```

To wipe the database and start fresh:

```bash
docker compose down -v
```

The `-v` flag removes the Postgres volume, so migrations will re-run on the next `up`.

## Database

Migrations live in `database/migrations/` as numbered SQL files. Filenames starting with `000_` are reserved for Docker init scripts (like creating the test database) and are skipped by the schema migration runner.

The schema:

- **users** — accounts with hashed passwords
- **jobs** — applications, foreign-keyed to users with cascade delete
- **contacts** — people associated with a job, foreign-keyed to both jobs and users
- **activities** — timestamped log entries per job, foreign-keyed to both jobs and users
- **triggers** — automatic `updated_at` maintenance via a Postgres trigger function

To apply migrations manually against a running database:

```bash
cd backend
npm run migrate
```

## API Overview

All routes except register and login require a `Bearer <token>` Authorization header.

| Method | Path                                          | Description                |
|--------|-----------------------------------------------|----------------------------|
| POST   | `/api/auth/register`                          | Create a new account       |
| POST   | `/api/auth/login`                             | Get a JWT                  |
| GET    | `/api/auth/me`                                | Current user info          |
| GET    | `/api/jobs`                                   | List all jobs for the user |
| POST   | `/api/jobs`                                   | Create a job               |
| GET    | `/api/jobs/:id`                               | Get a job                  |
| PUT    | `/api/jobs/:id`                               | Update a job               |
| DELETE | `/api/jobs/:id`                               | Delete a job               |
| GET    | `/api/jobs/:jobId/contacts`                   | List contacts for a job    |
| POST   | `/api/jobs/:jobId/contacts`                   | Add a contact              |
| PUT    | `/api/jobs/:jobId/contacts/:id`               | Update a contact           |
| DELETE | `/api/jobs/:jobId/contacts/:id`               | Delete a contact           |
| GET    | `/api/jobs/:jobId/activities`                 | List activities for a job  |
| POST   | `/api/jobs/:jobId/activities`                 | Log an activity            |
| PUT    | `/api/jobs/:jobId/activities/:id`             | Update an activity         |
| DELETE | `/api/jobs/:jobId/activities/:id`             | Delete an activity         |

## Roadmap

- [x] Authentication and protected routes
- [x] Jobs CRUD with grouped and list views
- [x] Job detail page with edit and delete
- [x] Contacts per job
- [x] Activities timeline per job
- [x] Dashboard with status summary and active pipeline
- [ ] Backend integration tests
- [ ] Frontend component tests
- [ ] CI/CD with preview deployments
- [ ] Production deployment
