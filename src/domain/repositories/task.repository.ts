import type { Task } from '@domain/entities/task.entity';
import type { TaskId } from '@domain/valueObjects/taskId.valueObject';
import type { TaskStatus } from '@domain/valueObjects/taskStatus.valueObject';
import type { Result } from '@shared/result.types';

export interface TaskRepository {
  save(task: Task): Promise<Result<void>>;

  findById(id: TaskId): Promise<Result<Task>>;

  findAll(): Promise<Result<Task[]>>;

  findByStatus(status: TaskStatus): Promise<Result<Task[]>>;

  findDueSoon(hoursThreshold?: number): Promise<Result<Task[]>>;

  delete(id: TaskId): Promise<Result<void>>;
}