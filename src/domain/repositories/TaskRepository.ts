import type { Task } from '@domain/entities/Task';
import type { TaskId } from '@domain/value-objects/TaskId';
import type { TaskStatus } from '@domain/value-objects/TaskStatus';
import type { Result } from '@shared/Result';

export interface TaskRepository {
  save(task: Task): Promise<Result<void>>;

  findById(id: TaskId): Promise<Result<Task>>;

  findAll(): Promise<Result<Task[]>>;

  findByStatus(status: TaskStatus): Promise<Result<Task[]>>;

  findDueSoon(hoursThreshold?: number): Promise<Result<Task[]>>;

  delete(id: TaskId): Promise<Result<void>>;
}