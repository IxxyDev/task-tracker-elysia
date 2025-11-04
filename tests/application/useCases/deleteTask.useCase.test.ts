import { describe, it, expect } from 'bun:test';
import { DeleteTaskUseCase } from '@application/useCases/deleteTask.useCase';
import type { TaskRepository } from '@domain/repositories/task.repository';
import type { Task } from '@domain/entities/task.entity';
import { TaskId } from '@domain/valueObjects/taskId.valueObject';
import { Ok, Err, type Result } from '@shared/result.types';
import { createMockTaskRepository } from '@tests/helpers/taskRepository.mock';
import { createTestTask } from '@tests/helpers/task.fixtures';
import { _1_DAY, _12_HOURS, VALID_TASK_ID } from '@tests/helpers/constants';

class MockTaskRepository implements TaskRepository {
  private mockDelete?: (id: TaskId) => Promise<Result<void>>;
  private mockFindById?: (id: TaskId) => Promise<Result<Task>>;

  setMockDelete(fn: (id: TaskId) => Promise<Result<void>>) {
    this.mockDelete = fn;
  }

  setMockFindById(fn: (id: TaskId) => Promise<Result<Task>>) {
    this.mockFindById = fn;
  }

  async delete(id: TaskId) {
    return this.mockDelete ? this.mockDelete(id) : Ok(undefined);
  }

  async findById(id: TaskId) {
    return this.mockFindById ? this.mockFindById(id) : Err('Not implemented');
  }

  async save() {
    return Ok(undefined);
  }

  async findAll() {
    return Ok([]);
  }

  async findByStatus() {
    return Ok([]);
  }

  async findDueSoon() {
    return Ok([]);
  }
}

describe("DeleteTaskUseCase", () => {
  describe("::deleting task", () => {
    it('should successfully delete existing task', async () => {
      const mockRepo = new MockTaskRepository();
      const useCase = new DeleteTaskUseCase(mockRepo);

      mockRepo.setMockDelete(() => Ok(undefined));

      const result = await useCase.execute({ taskId: VALID_TASK_ID });

      expect(result.ok).toEqual(true);
    });

    it('should return error for invalid task ID format', async () => {
      const mockRepo = new MockTaskRepository();
      const useCase = new DeleteTaskUseCase(mockRepo);

      const inVALID_TASK_ID = 'not-a-valid-uuid';

      const result = await useCase.execute({ taskId: inVALID_TASK_ID });

      expect(result.ok).toEqual(false);
      if (!result.ok) {
        expect(result.error).toEqual('Invalid TaskId format');
      }
    });
  });

  describe("::error handling", () => {
    it('should return error when repository fails to delete', async () => {
      const mockRepo = new MockTaskRepository();
      const useCase = new DeleteTaskUseCase(mockRepo);

      mockRepo.setMockDelete(() => Err('Database error'));

      const result = await useCase.execute({ taskId: VALID_TASK_ID });

      expect(result.ok).toEqual(false);
      if (!result.ok) {
        expect(result.error).toEqual('Database error');
      }
    });

    it('should return error when task ID is empty string', async () => {
      const mockRepo = new MockTaskRepository();
      const useCase = new DeleteTaskUseCase(mockRepo);

      const result = await useCase.execute({ taskId: '' });

      expect(result.ok).toEqual(false);
      if (!result.ok) {
        expect(result.error).toEqual('Invalid TaskId format');
      }
    });
  });
});
