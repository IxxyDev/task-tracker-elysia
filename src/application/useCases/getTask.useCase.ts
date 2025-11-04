import type { Task } from '@domain/entities/task.entity';
import type { TaskRepository } from '@domain/repositories/task.repository';
import { TaskId } from '@domain/valueObjects/taskId.valueObject';
import { Err, type Result } from '@shared/result.types';

export class GetTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(dto: GetTaskDTO): Promise<Result<Task>> {
    const taskId = TaskId.fromString(dto.taskId);
    if (!taskId.ok) {
      return Err(taskId.error);
    }

    const task = await this.taskRepository.findById(taskId.value);
    if (!task.ok) {
      return Err(task.error);
    }

    return task;
  }
}

export interface GetTaskDTO {
  taskId: string;
}
