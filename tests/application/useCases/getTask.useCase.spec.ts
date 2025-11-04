import { describe, it, expect } from 'bun:test';
import { GetTaskUseCase } from '@application/useCases/getTask.useCase';
import type { TaskRepository } from '@domain/repositories/task.repository';
import { Task } from '@domain/entities/task.entity';
import { Title } from '@domain/valueObjects/title.valueObject';
import { DueDate } from '@domain/valueObjects/dueDate.valueObject';
import { Ok, Err } from '@shared/result.types';

describe("GetTaskUseCase", () => {
  const _1_DAY = 24 * 60 * 60 * 1000;
  const validTaskId = '01933eb4-18a2-7123-8abc-123456789abc';

  describe("::execute", () => {
    it('should get task by id successfully', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);

      const mockRepository: TaskRepository = {
        save: async () => Err('Not implemented'),
        findById: async () => Ok(task),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new GetTaskUseCase(mockRepository);

      const result = await useCase.execute({ taskId: validTaskId });

      expect(result.value!.getTitle().toString()).toEqual('Buy groceries');
    });

    it('should reject invalid task id format', async () => {
      const mockRepository: TaskRepository = {
        save: async () => Err('Not implemented'),
        findById: async () => Err('Not implemented'),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new GetTaskUseCase(mockRepository);

      const result = await useCase.execute({ taskId: 'invalid-id' });

      expect(result.error).toEqual('Invalid TaskId format');
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

      const useCase = new GetTaskUseCase(mockRepository);

      const result = await useCase.execute({ taskId: validTaskId });

      expect(result.error).toEqual('Task not found');
    });

    it('should handle repository error', async () => {
      const mockRepository: TaskRepository = {
        save: async () => Err('Not implemented'),
        findById: async () => Err('Database connection failed'),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new GetTaskUseCase(mockRepository);

      const result = await useCase.execute({ taskId: validTaskId });

      expect(result.error).toEqual('Database connection failed');
    });
  });
});
