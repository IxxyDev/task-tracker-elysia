import { describe, it, expect } from 'bun:test';
import { UpdateTaskUseCase } from '@application/useCases/updateTask.useCase';
import type { TaskRepository } from '@domain/repositories/task.repository';
import { Task } from '@domain/entities/task.entity';
import { Title } from '@domain/valueObjects/title.valueObject';
import { DueDate } from '@domain/valueObjects/dueDate.valueObject';
import { Ok, Err } from '@shared/result.types';
import { _1_DAY, VALID_TASK_ID } from '@tests/helpers/constants';

describe("UpdateTaskUseCase", () => {
  const _2_DAYS = 2 * _1_DAY;

  describe("::execute", () => {
    it('should update task title', async () => {
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

      const useCase = new UpdateTaskUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        title: 'Buy vegetables',
      });

      expect(result.value).toEqual(undefined);
      expect(task.getTitle().toString()).toEqual('Buy vegetables');
    });

    it('should update task description', async () => {
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

      const useCase = new UpdateTaskUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        description: 'Organic products only',
      });

      expect(result.value).toEqual(undefined);
      expect(task.getDescription().toString()).toEqual('Organic products only');
    });

    it('should update task due date', async () => {
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

      const useCase = new UpdateTaskUseCase(mockRepository);
      const newDueDate = new Date(Date.now() + _2_DAYS);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        dueDate: newDueDate,
      });

      expect(result.value).toEqual(undefined);
    });

    it('should update multiple fields', async () => {
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

      const useCase = new UpdateTaskUseCase(mockRepository);
      const newDueDate = new Date(Date.now() + _2_DAYS);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        title: 'Buy vegetables',
        description: 'Organic only',
        dueDate: newDueDate,
      });

      expect(result.value).toEqual(undefined);
      expect(task.getTitle().toString()).toEqual('Buy vegetables');
      expect(task.getDescription().toString()).toEqual('Organic only');
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

      const useCase = new UpdateTaskUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: 'invalid-id',
        title: 'Buy vegetables',
      });

      expect(result.error).toEqual('Invalid TaskId format');
    });

    it('should reject invalid title', async () => {
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

      const useCase = new UpdateTaskUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        title: '',
      });

      expect(result.error).toEqual('Title cannot be empty');
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

      const useCase = new UpdateTaskUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        title: 'Buy vegetables',
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

      const useCase = new UpdateTaskUseCase(mockRepository);

      const result = await useCase.execute({
        taskId: VALID_TASK_ID,
        title: 'Buy vegetables',
      });

      expect(result.error).toEqual('Database connection failed');
    });
  });
});
