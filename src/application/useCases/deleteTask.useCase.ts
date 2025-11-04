import type { TaskRepository } from '@domain/repositories/task.repository';
import type { Result } from '@shared/result.types';
import { TaskId } from '@domain/valueObjects/taskId.valueObject';

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
