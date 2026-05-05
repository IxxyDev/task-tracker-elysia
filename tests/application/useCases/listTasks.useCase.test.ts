import { describe, it, expect } from 'bun:test';
import { ListTasksUseCase } from '@application/useCases/listTasks.useCase';
import type { TaskRepository } from '@domain/repositories/task.repository';
import { Task } from '@domain/entities/task.entity';
import { Title } from '@domain/valueObjects/title.valueObject';
import { DueDate } from '@domain/valueObjects/dueDate.valueObject';
import { TaskStatus } from '@domain/valueObjects/taskStatus.valueObject';
import { Ok, Err } from '@shared/result.types';
import { _1_DAY, _12_HOURS } from '@tests/helpers/constants';

describe("ListTasksUseCase", () => {

  describe("::execute", () => {
    it('should list all tasks', async () => {
      const title1 = Title.create('Buy groceries').value!;
      const title2 = Title.create('Clean house').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task1 = Task.create(title1, dueDate);
      const task2 = Task.create(title2, dueDate);

      const mockRepository: TaskRepository = {
        save: async () => Err('Not implemented'),
        findById: async () => Err('Not implemented'),
        findAll: async () => Ok([task1, task2]),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ListTasksUseCase(mockRepository);

      const result = await useCase.execute({});

      expect(result.value!.length).toEqual(2);
      expect(result.value![0]!.getTitle().toString()).toEqual('Buy groceries');
      expect(result.value![1]!.getTitle().toString()).toEqual('Clean house');
    });

    it('should filter by status', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);
      task.start();

      const mockRepository: TaskRepository = {
        save: async () => Err('Not implemented'),
        findById: async () => Err('Not implemented'),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Ok([task]),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ListTasksUseCase(mockRepository);

      const result = await useCase.execute({ status: 'in_progress' });

      expect(result.value!.length).toEqual(1);
      expect(result.value![0]!.getStatus()).toEqual(TaskStatus.IN_PROGRESS);
    });

    it('should filter by due soon', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _12_HOURS)).value!;
      const task = Task.create(title, dueDate);

      const mockRepository: TaskRepository = {
        save: async () => Err('Not implemented'),
        findById: async () => Err('Not implemented'),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Ok([task]),
      };

      const useCase = new ListTasksUseCase(mockRepository);

      const result = await useCase.execute({ dueSoon: true });

      expect(result.value!.length).toEqual(1);
      expect(result.value![0]!.isDueSoon()).toEqual(true);
    });

    it('should return empty array when no tasks', async () => {
      const mockRepository: TaskRepository = {
        save: async () => Err('Not implemented'),
        findById: async () => Err('Not implemented'),
        findAll: async () => Ok([]),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ListTasksUseCase(mockRepository);

      const result = await useCase.execute({});

      expect(result.value!.length).toEqual(0);
    });

    it('should reject invalid status', async () => {
      const mockRepository: TaskRepository = {
        save: async () => Err('Not implemented'),
        findById: async () => Err('Not implemented'),
        findAll: async () => Err('Not implemented'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ListTasksUseCase(mockRepository);

      const result = await useCase.execute({ status: 'invalid-status' });

      expect(result.error).toEqual('Invalid task status');
    });

    it('should handle repository error', async () => {
      const mockRepository: TaskRepository = {
        save: async () => Err('Not implemented'),
        findById: async () => Err('Not implemented'),
        findAll: async () => Err('Database connection failed'),
        delete: async () => Err('Not implemented'),
        findByStatus: async () => Err('Not implemented'),
        findDueSoon: async () => Err('Not implemented'),
      };

      const useCase = new ListTasksUseCase(mockRepository);

      const result = await useCase.execute({});

      expect(result.error).toEqual('Database connection failed');
    });
  });
});
