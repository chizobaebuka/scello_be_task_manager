# Task Management System API

A Task Management RESTful API for managing tasks, built with Node.js, Express.js, TypeScript, PostgreSQL, and Sequelize ORM. This project demonstrates clean code practices, authentication, error handling, and a layered architecture (routes → controllers → services → repositories → models).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authorization Model](#authorization-model)
- [Scaling & Performance](#scaling--performance)
- [Security](#security)

---

## Features

1. **Authentication & Authorization**:

   - User registration and login with JWT-based authentication (3h token expiry).
   - Password hashing using Argon2; password hashes are never returned by the API.
   - Role-based access (`user` / `admin`): users can only read/update/delete their own account; only admins can list all users or change a role.

2. **Task Management**:

   - Create, read, update, and delete tasks, scoped to the authenticated user.
   - Pagination and whitelisted sorting for task listing.
   - Time tracking and completion-rate reporting.

3. **Error Handling & Validation**:

   - Centralized error handling middleware with structured (pino) logging.
   - Input validation using Zod.

4. **Documentation**:
   - Swagger API documentation at `/api-doc`.

---

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Validation**: Zod
- **Password Hashing**: Argon2
- **Logging**: pino / pino-http
- **Documentation**: Swagger

## Setup Instructions

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (v18 or later).
2. Install [PostgreSQL](https://www.postgresql.org/).
3. Install [npm](https://www.npmjs.com/) (comes with Node.js).

---

### Steps to Start the Project

1. **Clone the Repository**:

   ```
   git clone git@github.com:chizobaebuka/scello_be_task_manager.git
   cd scello_be_task_manager
   ```

2. **Install Dependencies**:

   ```
   npm install
   ```

3. **Set Up Environment Variables**:

   Copy `.env.sample` to `.env` and fill in the values for your environment:

   ```
   cp .env.sample .env
   ```

4. **Run Migrations**:

   ```
   npm run migrate
   ```

5. **Start the Development Server**:

   ```
   npm run dev
   ```

   The server starts at `http://localhost:${PORT}` (default `4001`), with Swagger docs at `http://localhost:${PORT}/api-doc`.

6. **Build & Run for Production**:

   ```
   npm run build
   npm start
   ```

---

## Environment Variables

See `.env.sample` for the full list with defaults. Key groups:

| Variable | Purpose |
|---|---|
| `PORT`, `NODE_ENV`, `LOG_LEVEL` | Server basics and log verbosity (pino levels: `trace`…`fatal`) |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Database connection |
| `DB_POOL_MAX`, `DB_POOL_MIN`, `DB_POOL_ACQUIRE_MS`, `DB_POOL_IDLE_MS` | Sequelize connection pool sizing — tune `DB_POOL_MAX` to your expected concurrent request count and DB `max_connections` |
| `JWT_SECRET` | JWT signing secret |
| `CORS_ORIGIN` | Comma-separated allow-list of origins; blank allows all (dev only) |
| `BODY_LIMIT` | Max JSON/urlencoded body size (default `100kb`) |
| `RATE_LIMIT_*`, `AUTH_RATE_LIMIT_*` | General API and auth-endpoint rate limiting |

---

## API Endpoints

All routes are prefixed with `/api/v1`. Endpoints marked 🔒 require a `Authorization: Bearer <token>` header.

### Users (`/api/v1/users`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/create` | rate-limited | Register a new user |
| POST | `/login` | rate-limited | Log in, returns a JWT |
| GET | `/` | 🔒 admin only | List all users (paginated) |
| GET | `/:id` | 🔒 self or admin | Fetch a user by ID |
| PUT | `/:id` | 🔒 self or admin | Update a user (only an admin may change `role`) |
| DELETE | `/:id` | 🔒 self or admin | Delete a user |

**POST `/api/v1/users/create`**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```

**POST `/api/v1/users/login`**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```

### Task Management (`/api/v1/tasks`) — all routes 🔒

| Method | Path | Description |
|---|---|---|
| POST | `/create` | Create a new task |
| GET | `/` | List the authenticated user's tasks (paginated, sortable) |
| GET | `/report-time` | Time spent on tasks in a date range |
| GET | `/report` | Task completion-rate report |
| GET | `/:id` | Fetch a task by ID |
| PUT | `/:id` | Update a task by ID |
| DELETE | `/:id` | Delete a task by ID |

**POST `/api/v1/tasks/create`**
```json
{
  "title": "Complete project documentation",
  "description": "Write detailed documentation for the project",
  "status": "pending"
}
```

**GET `/api/v1/tasks`** — query parameters:
```json
{
  "page": 1,
  "limit": 10,
  "sortBy": "createdAt",
  "sortOrder": "ASC"
}
```
- `limit` is capped at 100 regardless of the requested value.
- `sortBy` must be one of `createdAt`, `updatedAt`, `title`, `status`, `startTime`, `endTime` (falls back to `createdAt` otherwise). The same whitelisting applies to user listing with `createdAt`, `updatedAt`, `name`, `email`.

**PUT `/api/v1/tasks/:id`**
```json
{
  "title": "Complete project documentation (updated)",
  "status": "in-progress"
}
```

**GET `/api/v1/tasks/report-time`** — query parameters:
```json
{
  "startDate": "2025-05-01",
  "endDate": "2025-05-23"
}
```

**GET `/api/v1/tasks/report`**
```json
{
  "totalTasks": 10,
  "completedTasks": 7,
  "completionRate": "70%"
}
```

### Health

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness — process is up, no dependency checks |
| GET | `/health/ready` | Readiness — verifies the DB connection; returns 503 if unreachable |

---

## Authorization Model

- **Tasks** are always scoped to `req.user.userId` at the repository layer — a user can never read/modify another user's tasks regardless of ID guessing.
- **Users**: `GET /:id`, `PUT /:id`, `DELETE /:id` require the caller to either be the account owner or hold the `admin` role. `GET /` (list all users) is admin-only. A non-admin caller cannot set `role` on their own account via `PUT /:id` — that field is silently dropped unless the requester is an admin.

---

## Scaling & Performance

Changes made in this pass to support running under real load:

- **Database indexes**: `Tasks(userId)`, `Tasks(userId, status)`, and `Tasks(userId, createdAt)` — every task query filters by `userId`, and these were previously unindexed full table scans.
- **Connection pooling**: Sequelize pool size/timeouts are now configurable via `DB_POOL_*` env vars instead of relying on the default (max 5) pool.
- **Pagination guardrails**: `limit` is capped at 100 server-side so a client can't force an unbounded scan/payload via `?limit=`; `sortBy` is validated against a column whitelist instead of being passed straight into the SQL `ORDER BY` clause.
- **Response compression**: `compression` middleware for gzip'd JSON responses.
- **Structured logging**: replaced ad-hoc `console.log`/`console.error` with `pino`/`pino-http`, so logs are JSON and log level is configurable (`LOG_LEVEL`) — important once logs are shipped to an aggregator instead of read from a terminal.
- **Graceful shutdown**: the server now closes the HTTP listener and the DB pool on `SIGTERM`/`SIGINT` (with a forced-exit timeout), which matters for zero-downtime deploys / rolling restarts under an orchestrator.
- **Liveness vs. readiness**: `/health` is a cheap process check; `/health/ready` verifies the DB so a load balancer/orchestrator can gate traffic without every health check hitting Postgres.
- **Startup failure is now fatal**: previously a failed DB connection was logged but the process kept running without ever opening a port; it now exits non-zero so an orchestrator restarts it.
- **Fixed a routing bug** where `/api/v1/tasks/report` and `/report-time` were shadowed by the `/:id` route and were unreachable.

Not implemented here, worth considering as load grows further (each adds an infra dependency, so intentionally left out of this pass):

- A read-through cache (e.g. Redis) in front of `GET /report` / `GET /report-time` if reporting becomes hot.
- Read replicas + routing read-only queries (listing, reports) to a replica.
- Horizontal scaling of the API behind a load balancer — the app is stateless (JWT auth, no in-memory session), so this only requires the DB pool sizing above to account for N instances × `DB_POOL_MAX` ≤ Postgres `max_connections`.

---

## Security

- Passwords are hashed with Argon2 and are **never** included in any API response (registration, login, get/list/update user).
- Updating a user's password via `PUT /:id` re-hashes it — it is never stored in plaintext.
- JWTs expire after 3 hours.
- `/create` and `/login` have a tighter rate limit than the rest of the API to slow down credential stuffing / brute force.
- `helmet()` sets standard security headers; CORS origins are configurable via `CORS_ORIGIN` (default allows all — set this explicitly in production).
- Request body size is capped (`BODY_LIMIT`, default 100kb).
