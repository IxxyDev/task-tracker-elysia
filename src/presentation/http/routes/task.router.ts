import { Elysia } from 'elysia';
import type { CreateTaskUseCase } from '@application/useCases/createTask.useCase';
import type { GetTaskUseCase } from '@application/useCases/getTask.useCase';
import type { UpdateTaskUseCase } from '@application/useCases/updateTask.useCase';
import type { ChangeTaskStatusUseCase } from '@application/useCases/changeTaskStatus.useCase';
import type { ListTasksUseCase } from '@application/useCases/listTasks.useCase';
import type { DeleteTaskUseCase } from '@application/useCases/deleteTask.useCase';
import { TaskResponseDTO } from '../dtos/taskResponse.dto';
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  ChangeStatusSchema,
  TaskIdParamSchema,
  ListTasksQuerySchema,
} from '../schemas/task.validation.schemas';
import { HttpStatus } from '../constants/http.consts';
import { mapErrorToHttpStatus } from '../errors/errorMapper';
import * as v from 'valibot';

export const createTaskRoutes = (
  createTaskUseCase: CreateTaskUseCase,
  getTaskUseCase: GetTaskUseCase,
  updateTaskUseCase: UpdateTaskUseCase,
  changeTaskStatusUseCase: ChangeTaskStatusUseCase,
  listTasksUseCase: ListTasksUseCase,
  deleteTaskUseCase: DeleteTaskUseCase
) => {
  return new Elysia({ prefix: '/tasks' })
    .post(
      '/',
      async ({ body, set }) => {
        const validated = v.parse(CreateTaskSchema, body);

        const result = await createTaskUseCase.execute({
          title: validated.title,
          description: validated.description,
          dueDate: new Date(validated.dueDate),
        });

        if (!result.ok) {
          set.status = mapErrorToHttpStatus(result.error);
          return { error: result.error };
        }

        set.status = HttpStatus.CREATED;
        return {
          id: result.value.toString(),
          message: 'Task created successfully',
        };
      },
      {
        detail: {
          summary: 'Create a new task',
          tags: ['Tasks'],
        },
      }
    )

    .get(
      '/:id',
      async ({ params, set }) => {
        const validated = v.parse(TaskIdParamSchema, params);

        const result = await getTaskUseCase.execute({
          taskId: validated.id,
        });

        if (!result.ok) {
          set.status = mapErrorToHttpStatus(result.error);
          return { error: result.error };
        }

        return TaskResponseDTO.fromDomain(result.value);
      },
      {
        detail: {
          summary: 'Get task by ID',
          tags: ['Tasks'],
        },
      }
    )

    .put(
      '/:id',
      async ({ params, body, set }) => {
        const validatedParams = v.parse(TaskIdParamSchema, params);
        const validatedBody = v.parse(UpdateTaskSchema, body);

        const result = await updateTaskUseCase.execute({
          taskId: validatedParams.id,
          title: validatedBody.title,
          description: validatedBody.description,
          dueDate: validatedBody.dueDate ? new Date(validatedBody.dueDate) : undefined,
        });

        if (!result.ok) {
          set.status = mapErrorToHttpStatus(result.error);
          return { error: result.error };
        }

        return { message: 'Task updated successfully' };
      },
      {
        detail: {
          summary: 'Update task',
          tags: ['Tasks'],
        },
      }
    )

    .delete(
      '/:id',
      async ({ params, set }) => {
        const validated = v.parse(TaskIdParamSchema, params);

        const result = await deleteTaskUseCase.execute({
          taskId: validated.id,
        });

        if (!result.ok) {
          set.status = mapErrorToHttpStatus(result.error);
          return { error: result.error };
        }

        set.status = HttpStatus.OK;
        return { message: 'Task deleted successfully' };
      },
      {
        detail: {
          summary: 'Delete task',
          tags: ['Tasks'],
        },
      }
    )

    .patch(
      '/:id/status',
      async ({ params, body, set }) => {
        const validatedParams = v.parse(TaskIdParamSchema, params);
        const validatedBody = v.parse(ChangeStatusSchema, body);

        const result = await changeTaskStatusUseCase.execute({
          taskId: validatedParams.id,
          action: validatedBody.action,
        });

        if (!result.ok) {
          set.status = mapErrorToHttpStatus(result.error);
          return { error: result.error };
        }

        return { message: 'Task status updated successfully' };
      },
      {
        detail: {
          summary: 'Change task status',
          tags: ['Tasks'],
        },
      }
    )

    .get(
      '/',
      async ({ query, set }) => {
        const validated = v.parse(ListTasksQuerySchema, query);

        const result = await listTasksUseCase.execute({
          status: validated.status,
          dueSoon: validated.dueSoon,
          hoursThreshold: validated.hoursThreshold,
        });

        if (!result.ok) {
          set.status = mapErrorToHttpStatus(result.error);
          return { error: result.error };
        }

        return TaskResponseDTO.fromDomainList(result.value);
      },
      {
        detail: {
          summary: 'List tasks with filters',
          tags: ['Tasks'],
        },
      }
    );
};
