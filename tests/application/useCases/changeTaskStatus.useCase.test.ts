import { describe, it, expect } from 'bun:test';
import { ChangeTaskStatusUseCase } from '@application/useCases/changeTaskStatus.useCase';
import type { TaskRepository } from '@domain/repositories/task.repository';
import { Task } from '@domain/entities/task.entity';
import { Title } from '@domain/valueObjects/title.valueObject';
import { DueDate } from '@domain/valueObjects/dueDate.valueObject';
import { TaskStatus } from '@domain/valueObjects/taskStatus.valueObject';
import { Ok, Err } from '@shared/result.types';
import { createMockTaskRepository } from '@tests/helpers/taskRepository.mock';
import { createTestTask } from '@tests/helpers/task.fixtures';
import { _1_DAY, _12_HOURS, VALID_TASK_ID } from '@tests/helpers/constants';

describe("ChangeTaskStatusUseCase", () => {

  describe("::execute", () => {
    it('should start pending task', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);

      const mockRepository: TaskRepository = {
        save: async () => Ok(undefined),
        findById: async () => Ok(task),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ChangeTaskStatusUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        action: 'start',
      });

      expect(result.value).toEqual(undefined);
      expect(task.getStatus()).toEqual(TaskStatus.IN_PROGRESS);
    });

    it('should complete in-progress task', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);
      task.start();

      const mockRepository: TaskRepository = {
        save: async () => Ok(undefined),
        findById: async () => Ok(task),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ChangeTaskStatusUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        action: 'complete',
      });

      expect(result.value).toEqual(undefined);
      expect(task.getStatus()).toEqual(TaskStatus.COMPLETED);
    });

    it('should cancel pending task', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);

      const mockRepository: TaskRepository = {
        save: async () => Ok(undefined),
        findById: async () => Ok(task),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ChangeTaskStatusUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        action: 'cancel',
      });

      expect(result.value).toEqual(undefined);
      expect(task.getStatus()).toEqual(TaskStatus.CANCELLED);
    });

    it('should reject invalid task id', async () => {
      const mockRepository: TaskRepository = {
        save: async () => Err('Not implemented'),
        findById: async () => Err('Not implemented'),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ChangeTaskStatusUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: 'invalid-id',
        action: 'start',
      });

      expect(result.error).toEqual('Invalid TaskId format');
    });

    it('should reject completing cancelled task', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);
      task.cancel();

      const mockRepository: TaskRepository = {
        save: async () => Ok(undefined),
        findById: async () => Ok(task),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ChangeTaskStatusUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        action: 'complete',
      });

      expect(result.error).toEqual('Cannot complete a cancelled task');
    });

    it('should reject cancelling completed task', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);
      task.start();
      task.complete();

      const mockRepository: TaskRepository = {
        save: async () => Ok(undefined),
        findById: async () => Ok(task),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ChangeTaskStatusUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        action: 'cancel',
      });

      expect(result.error).toEqual('Cannot cancel a completed task');
    });

    it('should handle task not found', async () => {
      const mockRepository: TaskRepository = {
        save: async () => Err('Not implemented'),
        findById: async () => Err('Task not found'),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ChangeTaskStatusUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        action: 'start',
      });

      expect(result.error).toEqual('Task not found');
    });

    it('should handle repository save error', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);

      const mockRepository: TaskRepository = {
        save: async () => Err('Database connection failed'),
        findById: async () => Ok(task),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ChangeTaskStatusUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        action: 'start',
      });

      expect(result.error).toEqual('Database connection failed');
    });
  });
});
