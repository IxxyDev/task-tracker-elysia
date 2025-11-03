import type { Task } from '@domain/entities/Task';
import type { TaskRepository } from '@domain/repositories/TaskRepository';
import { TaskStatus } from '@domain/value-objects/TaskStatus';
import { Err, type Result } from '@shared/Result';

export class ListTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(dto: ListTasksDTO): Promise<Result<Task[]>> {
    if (dto.status !== undefined) {
      const status = TaskStatus.fromString(dto.status);
      if (!status.ok) {
        return Err(status.error);
      }

      return await this.taskRepository.findByStatus(status.value);
    }

    if (dto.dueSoon) {
      return await this.taskRepository.findDueSoon(dto.hoursThreshold);
    }

    return await this.taskRepository.findAll();
  }
}

export interface ListTasksDTO {
  status?: string;
  dueSoon?: boolean;
  hoursThreshold?: number;
}
