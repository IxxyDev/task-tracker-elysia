import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';

import { db } from '@infrastructure/database/db.connection';
import { DrizzleTaskRepository } from '@infrastructure/database/task.db.repository';

import { CreateTaskUseCase } from '@application/useCases/createTask.useCase';
import { GetTaskUseCase } from '@application/useCases/getTask.useCase';
import { UpdateTaskUseCase } from '@application/useCases/updateTask.useCase';
import { ChangeTaskStatusUseCase } from '@application/useCases/changeTaskStatus.useCase';
import { ListTasksUseCase } from '@application/useCases/listTasks.useCase';
import { DeleteTaskUseCase } from '@application/useCases/deleteTask.useCase';

import { createTaskRoutes } from '@presentation/http/routes/task.router';
import { HttpStatus } from '@presentation/http/constants/http.consts';

const PORT = process.env.PORT || 3000;

const taskRepository = new DrizzleTaskRepository(db);

const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const getTaskUseCase = new GetTaskUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const changeTaskStatusUseCase = new ChangeTaskStatusUseCase(taskRepository);
const listTasksUseCase = new ListTasksUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

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
      listTasksUseCase,
      deleteTaskUseCase
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
