import { describe, it, expect } from 'bun:test';
import { GetTaskUseCase } from '@application/useCases/getTask.useCase';
import { Ok, Err } from '@shared/result.types';
import { createMockTaskRepository } from '@tests/helpers/taskRepository.mock';
import { createTestTask } from '@tests/helpers/task.fixtures';
import { _1_DAY, VALID_TASK_ID } from '@tests/helpers/constants';

describe("GetTaskUseCase", () => {

  describe("::execute", () => {
    it('should get task by id successfully', async () => {
      const task = createTestTask({ title: 'Buy groceries' });

      const mockRepository = createMockTaskRepository({
        findById: async () => Ok(task),
      });

      const useCase = new GetTaskUseCase(mockRepository);

      const result = await useCase.execute({ taskId: VALID_TASK_ID });

      expect(result.value!.getTitle().toString()).toEqual('Buy groceries');
    });

    it('should reject invalid task id format', async () => {
      const mockRepository = createMockTaskRepository();

      const useCase = new GetTaskUseCase(mockRepository);

      const result = await useCase.execute({ taskId: 'invalid-id' });

      expect(result.error).toEqual('Invalid TaskId format');
    });

    it('should handle task not found', async () => {
      const mockRepository = createMockTaskRepository({
        findById: async () => Err('Task not found'),
      });

      const useCase = new GetTaskUseCase(mockRepository);

      const result = await useCase.execute({ taskId: VALID_TASK_ID });

      expect(result.error).toEqual('Task not found');
    });

    it('should handle repository error', async () => {
      const mockRepository = createMockTaskRepository({
        findById: async () => Err('Database connection failed'),
      });

      const useCase = new GetTaskUseCase(mockRepository);

      const result = await useCase.execute({ taskId: VALID_TASK_ID });

      expect(result.error).toEqual('Database connection failed');
    });
  });
});
