import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';

import { createUseCases } from '@infrastructure/composition/dependencies';
import { createTaskRoutes } from '@presentation/http/routes/task.router';
import { HttpStatus } from '@presentation/http/constants/http.consts';

const PORT = process.env.PORT || 3000;

const useCases = createUseCases();

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
      useCases.createTask,
      useCases.getTask,
      useCases.updateTask,
      useCases.changeTaskStatus,
      useCases.listTasks,
      useCases.deleteTask
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
