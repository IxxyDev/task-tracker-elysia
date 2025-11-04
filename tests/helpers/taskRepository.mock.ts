import type { TaskRepository } from '@domain/repositories/task.repository';
import type { Task } from '@domain/entities/task.entity';
import type { TaskId } from '@domain/valueObjects/taskId.valueObject';
import type { TaskStatus } from '@domain/valueObjects/taskStatus.valueObject';
import type { Result } from '@shared/result.types';
import { Ok, Err } from '@shared/result.types';

/**
 * Partial overrides for mock repository methods
 */
export interface MockTaskRepositoryOverrides {
  save?: (task: Task) => Promise<Result<void>>;
  findById?: (id: TaskId) => Promise<Result<Task>>;
  findAll?: () => Promise<Result<Task[]>>;
  delete?: (id: TaskId) => Promise<Result<void>>;
  findByStatus?: (status: TaskStatus) => Promise<Result<Task[]>>;
  findDueSoon?: (hoursThreshold?: number) => Promise<Result<Task[]>>;
}

/**
 * Creates a mock TaskRepository with default stub implementations
 * and optional method overrides
 */
export function createMockTaskRepository(
  overrides: MockTaskRepositoryOverrides = {}
): TaskRepository {
  return {
    save: overrides.save ?? (async () => Ok(undefined)),
    findById: overrides.findById ?? (async () => Err('Not implemented')),
    findAll: overrides.findAll ?? (async () => Err('Not implemented')),
    delete: overrides.delete ?? (async () => Err('Not implemented')),
    findByStatus: overrides.findByStatus ?? (async () => Err('Not implemented')),
    findDueSoon: overrides.findDueSoon ?? (async () => Err('Not implemented')),
  };
}
