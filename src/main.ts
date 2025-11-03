import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';

import { db } from '@infrastructure/database/connection';
import { DrizzleTaskRepository } from '@infrastructure/database/DrizzleTaskRepository';

import { CreateTaskUseCase } from '@application/use-cases/CreateTaskUseCase';
import { GetTaskUseCase } from '@application/use-cases/GetTaskUseCase';
import { UpdateTaskUseCase } from '@application/use-cases/UpdateTaskUseCase';
import { ChangeTaskStatusUseCase } from '@application/use-cases/ChangeTaskStatusUseCase';
import { ListTasksUseCase } from '@application/use-cases/ListTasksUseCase';

import { createTaskRoutes } from '@presentation/http/routes/tasks.routes';
import { HttpStatus } from '@presentation/http/constants/http-status';

const PORT = process.env.PORT || 3000;

const taskRepository = new DrizzleTaskRepository(db);

const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const getTaskUseCase = new GetTaskUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const changeTaskStatusUseCase = new ChangeTaskStatusUseCase(taskRepository);
const listTasksUseCase = new ListTasksUseCase(taskRepository);

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Task Management API',
          version: '1.0.0',
          description: 'Clean Architecture Task Management with DDD',
        },
        tags: [
          { name: 'Tasks', description: 'Task management endpoints' },
        ],
      },
    })
  )
  .onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = HttpStatus.BAD_REQUEST;
      return {
        error: 'Validation failed',
        message: error.message,
      };
    }

    if (code === 'NOT_FOUND') {
      set.status = HttpStatus.NOT_FOUND;
      return {
        error: 'Not found',
        message: error.message,
      };
    }

    set.status = HttpStatus.INTERNAL_SERVER_ERROR;
    return {
      error: 'Internal server error',
      message: error.message,
    };
  })
  .use(
    createTaskRoutes(
      createTaskUseCase,
      getTaskUseCase,
      updateTaskUseCase,
      changeTaskStatusUseCase,
      listTasksUseCase
    )
  )
  .get('/', () => ({
    message: 'Task Management API',
    version: '1.0.0',
    docs: '/swagger',
  }))
  .listen(PORT);

console.log(`🦊 Server running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 Swagger docs at http://${app.server?.hostname}:${app.server?.port}/swagger`);
