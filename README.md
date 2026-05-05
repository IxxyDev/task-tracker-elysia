# task-tracker-elysia

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Bun](https://img.shields.io/badge/runtime-Bun-fbf0df)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)

Task management API built on Bun + Elysia, structured as a Clean Architecture / DDD reference: domain layer with entities and value objects, application layer with use cases, infrastructure layer for persistence and workers, presentation layer for HTTP and validation.

A scheduled worker watches for tasks approaching their due date and emits notifications.

## Why this exists

I spent most of my career on frontend, but I've been pulled into backend work often enough that I wanted a personal reference for "how I want to structure a Node-style backend when nothing is forcing me into a specific shape." This is that reference.

A few things I deliberately wanted to try:

- **Bun + Elysia** — to evaluate the new runtime + framework combo against the Node.js + Express/Fastify default
- **Drizzle ORM** with the typed query builder, plus `drizzle-kit` for either fast `db:push` syncs in dev or generated migration files when needed
- **Strict layer separation** — domain code has zero awareness of Elysia, Postgres, or Drizzle. Repositories are interfaces in the domain layer, implemented in infrastructure.
- **Valibot for schema validation** instead of Zod, to compare DX and bundle size
- **Result type** in the application layer — use cases return `Ok | Err` discriminated unions instead of throwing

Everything is small enough to read end-to-end in one sitting.

## Architecture

```
src/
├── domain/           # Entities, value objects, repository interfaces
├── application/      # Use cases (business logic, orchestration), Result type
├── infrastructure/   # Repository impls, DB connection, scheduled workers, DI composition
├── presentation/     # HTTP routes, DTOs, request validation, error mapping
└── shared/           # Cross-layer primitives (Result, AppConfig)
```

Dependencies flow inward: `presentation → application → domain`, with `infrastructure` plugged in via interfaces. The domain layer has no third-party imports.

## Tech stack

- **Bun** — runtime
- **Elysia** — web framework
- **Drizzle ORM** + `drizzle-kit` — typed SQL, schema sync, optional migrations
- **PostgreSQL 16** — storage
- **Valibot** — schema validation
- **Docker Compose** — local Postgres

## Quick start

```bash
# 1. Install
bun install

# 2. Configure environment
cp .env.example .env
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/tasks
# PORT=3000
# NOTIFICATION_WINDOW_HOURS=24
# NOTIFICATION_CHECK_INTERVAL_MS=300000

# 3. Start Postgres
docker compose up -d

# 4. Sync the schema to the database
bun run db:push

# 5. Start the API
bun run dev
```

- Server: `http://localhost:3000`
- OpenAPI docs: `http://localhost:3000/swagger`

To start the notification worker (separate process):

```bash
bun run worker
```

### Database workflow

`bun run db:push` syncs the schema in `src/infrastructure/database/task.db.schema.ts` directly to the database — convenient for local dev. For a migration-based workflow, `bun run db:generate` produces SQL files under `./drizzle/` that you can review and apply explicitly. `bun run db:studio` launches Drizzle Studio against the configured database.

## Testing

```bash
bun test                       # all tests
bun run test:domain            # domain layer only (no I/O)
bun run test:application       # application layer only (mocked repos)
bun run test:infrastructure    # infrastructure layer (DB-touching)
```

Tests are split by architectural layer. Domain and application tests have no I/O dependencies; infrastructure tests exercise the real Drizzle repository against Postgres.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `POST`   | `/tasks`            | Create a task |
| `GET`    | `/tasks`            | List tasks (filterable) |
| `GET`    | `/tasks/:id`        | Get one task |
| `PUT`    | `/tasks/:id`        | Update title / description / due date (all fields optional — used as partial update for simplicity) |
| `PATCH`  | `/tasks/:id/status` | Transition state (`start` \| `complete` \| `cancel`) |
| `DELETE` | `/tasks/:id`        | Delete a task |

`GET /tasks` accepts the following query parameters:

- `status` — `pending` \| `in_progress` \| `completed` \| `cancelled`
- `dueSoon` — `true` to filter tasks approaching their due date
- `hoursThreshold` — number of hours used by the `dueSoon` window (defaults to 24)

### Examples

```bash
# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy milk",
    "description": "Corner store",
    "dueDate": "2026-12-01T10:00:00Z"
  }'

# List tasks
curl http://localhost:3000/tasks

# Filter: only pending tasks due within the next 12 hours
curl 'http://localhost:3000/tasks?status=pending&dueSoon=true&hoursThreshold=12'

# Get one task
curl http://localhost:3000/tasks/{id}

# Change status (start | complete | cancel)
curl -X PATCH http://localhost:3000/tasks/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}'

# Update (partial — any subset of fields)
curl -X PUT http://localhost:3000/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"title": "New title"}'

# Delete
curl -X DELETE http://localhost:3000/tasks/{id}
```

Or use the Swagger UI at `/swagger`.

## License

MIT — see [LICENSE](LICENSE).
