import type { TaskRepository } from '@domain/repositories/task.repository';
import { TaskId } from '@domain/valueObjects/taskId.valueObject';
import { Err, Ok, type Result } from '@shared/result.types';

export class ChangeTaskStatusUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(dto: ChangeTaskStatusDTO): Promise<Result<void>> {
    const taskId = TaskId.fromString(dto.taskId);
    if (!taskId.ok) {
      return Err(taskId.error);
    }

    const taskResult = await this.taskRepository.findById(taskId.value);
    if (!taskResult.ok) {
      return Err(taskResult.error);
    }

    const task = taskResult.value;

    const actionResult = task.executeAction(dto.action);
    if (!actionResult.ok) {
      return Err(actionResult.error);
    }

    const saveResult = await this.taskRepository.save(task);
    if (!saveResult.ok) {
      return Err(saveResult.error);
    }

    return Ok(undefined);
  }
}

export interface ChangeTaskStatusDTO {
  taskId: string;
  action: 'start' | 'complete' | 'cancel';
}
