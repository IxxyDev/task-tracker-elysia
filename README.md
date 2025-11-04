# Task Management API

Clean Architecture backend с DDD на Bun.js и Elysia.js.

## Быстрый старт

### 1. Установка зависимостей
```bash
bun install
```

### 2. Настройка окружения
Создай `.env` файл:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tasks
PORT=3000
NOTIFICATION_CHECK_INTERVAL_MS=60000
NOTIFICATION_WINDOW_HOURS=24
```

### 3. Запуск PostgreSQL
```bash
docker-compose up -d
```

### 4. Применение миграций
```bash
bun run db:push
```

### 5. Запуск сервера
```bash
bun run dev
```

API доступен на http://localhost:3000
Swagger документация: http://localhost:3000/swagger

### 6. Запуск worker (опционально)
В отдельном терминале:
```bash
bun run worker
```

## Тестирование

### Unit тесты
```bash
bun test
```

Запуск конкретных тестов:
```bash
bun run test:domain
bun run test:application
bun run test:infrastructure
```

### API тестирование

#### Через Swagger UI
Открой http://localhost:3000/swagger

#### Через curl

**Создать задачу:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Купить молоко",
    "description": "В магазине на углу",
    "dueDate": "2025-12-01T10:00:00Z"
  }'
```

**Список задач:**
```bash
curl http://localhost:3000/tasks
```

**Получить задачу:**
```bash
curl http://localhost:3000/tasks/{id}
```

**Изменить статус:**
```bash
curl -X PATCH http://localhost:3000/tasks/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}'
```

**Обновить задачу:**
```bash
curl -X PUT http://localhost:3000/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Новое название",
    "description": "Новое описание"
  }'
```

**Удалить задачу:**
```bash
curl -X DELETE http://localhost:3000/tasks/{id}
```

## Архитектура

```
src/
├── domain/           # Entities, Value Objects, Repository interfaces
├── application/      # Use Cases (business logic)
├── infrastructure/   # Repository implementations, DB, Workers
└── presentation/     # HTTP routes, DTOs, validation schemas
```

## Технологии

- **Bun.js** - Runtime
- **Elysia.js** - Web framework
- **DrizzleORM** - Database ORM
- **PostgreSQL** - Database
- **Valibot** - Schema validation
- **Docker** - Container orchestration
