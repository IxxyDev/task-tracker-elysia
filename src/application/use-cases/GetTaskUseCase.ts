import type { Task } from '@domain/entities/Task';
import type { TaskRepository } from '@domain/repositories/TaskRepository';
import { TaskId } from '@domain/value-objects/TaskId';
import { Err, type Result } from '@shared/Result';

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
