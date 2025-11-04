import { describe, it, expect } from 'bun:test';
import { CreateTaskUseCase } from '@application/useCases/createTask.useCase';
import type { TaskRepository } from '@domain/repositories/task.repository';
import { Ok, Err } from '@shared/result.types';

describe("CreateTaskUseCase", () => {
  const _1_DAY = 24 * 60 * 60 * 1000;

  describe("::execute", () => {
    it('should create task successfully', async () => {
      const mockRepository: TaskRepository = {
        save: async () => Ok(undefined),
        findById: async () => Err('Not implemented'),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new CreateTaskUseCase(mockRepository);
      const futureDate = new Date(Date.now() + _1_DAY);

      const result = await useCase.execute({
        title: 'Buy groceries',
        description: 'Milk and eggs',
        dueDate: futureDate,
      });

      expect(result.value!.toString()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should create task without description', async () => {
      const mockRepository: TaskRepository = {
        save: async () => Ok(undefined),
        findById: async () => Err('Not implemented'),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new CreateTaskUseCase(mockRepository);
      const futureDate = new Date(Date.now() + _1_DAY);

      const result = await useCase.execute({
        title: 'Buy groceries',
        dueDate: futureDate,
      });

      expect(result.value!.toString()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should reject empty title', async () => {
      const mockRepository: TaskRepository = {
        save: async () => Ok(undefined),
        findById: async () => Err('Not implemented'),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new CreateTaskUseCase(mockRepository);
      const futureDate = new Date(Date.now() + _1_DAY);

      const result = await useCase.execute({
        title: '',
        dueDate: futureDate,
      });

      expect(result.error).toEqual('Title cannot be empty');
    });

    it('should reject past due date', async () => {
      const mockRepository: TaskRepository = {
        save: async () => Ok(undefined),
        findById: async () => Err('Not implemented'),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new CreateTaskUseCase(mockRepository);
      const pastDate = new Date(Date.now() - _1_DAY);

      const result = await useCase.execute({
        title: 'Buy groceries',
        dueDate: pastDate,
      });

      expect(result.error).toEqual('Due date cannot be in the past');
    });

    it('should handle repository save error', async () => {
      const mockRepository: TaskRepository = {
        save: async () => Err('Database connection failed'),
        findById: async () => Err('Not implemented'),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new CreateTaskUseCase(mockRepository);
      const futureDate = new Date(Date.now() + _1_DAY);

      const result = await useCase.execute({
        title: 'Buy groceries',
        dueDate: futureDate,
      });

      expect(result.error).toEqual('Database connection failed');
    });
  });
});
