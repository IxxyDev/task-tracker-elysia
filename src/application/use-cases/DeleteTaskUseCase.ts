import type { TaskRepository } from '@domain/repositories/TaskRepository';
import type { Result } from '@shared/Result';
import { TaskId } from '@domain/value-objects/TaskId';

export interface DeleteTaskDTO {
  taskId: string;
}

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(dto: DeleteTaskDTO): Promise<Result<void>> {
    const taskId = TaskId.fromString(dto.taskId);

    if (!taskId.ok) {
      return taskId;
    }

    return await this.taskRepository.delete(taskId.value);
  }
}
