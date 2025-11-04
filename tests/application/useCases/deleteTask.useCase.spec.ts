import { describe, it, expect } from 'bun:test';
import { DeleteTaskUseCase } from '@application/useCases/deleteTask.useCase';
import type { TaskRepository } from '@domain/repositories/task.repository';
import { TaskId } from '@domain/valueObjects/taskId.valueObject';
import { Ok, Err } from '@shared/result.types';

class MockTaskRepository implements TaskRepository {
  private mockDelete: any;
  private mockFindById: any;

  setMockDelete(fn: any) {
    this.mockDelete = fn;
  }

  setMockFindById(fn: any) {
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

      const validTaskId = '01963d00-0000-7000-8000-000000000001';
      mockRepo.setMockDelete(() => Ok(undefined));

      const result = await useCase.execute({ taskId: validTaskId });

      expect(result.ok).toEqual(true);
    });

    it('should return error for invalid task ID format', async () => {
      const mockRepo = new MockTaskRepository();
      const useCase = new DeleteTaskUseCase(mockRepo);

      const invalidTaskId = 'not-a-valid-uuid';

      const result = await useCase.execute({ taskId: invalidTaskId });

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

      const validTaskId = '01963d00-0000-7000-8000-000000000001';
      mockRepo.setMockDelete(() => Err('Database error'));

      const result = await useCase.execute({ taskId: validTaskId });

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
