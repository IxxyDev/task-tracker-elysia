import type { TaskRepository } from '@domain/repositories/TaskRepository';
import { TaskId } from '@domain/value-objects/TaskId';
import { Title } from '@domain/value-objects/Title';
import { Description } from '@domain/value-objects/Description';
import { DueDate } from '@domain/value-objects/DueDate';
import { Err, Ok, type Result } from '@shared/Result';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(dto: UpdateTaskDTO): Promise<Result<void>> {
    const taskId = TaskId.fromString(dto.taskId);
    if (!taskId.ok) {
      return Err(taskId.error);
    }

    const taskResult = await this.taskRepository.findById(taskId.value);
    if (!taskResult.ok) {
      return Err(taskResult.error);
    }

    const task = taskResult.value;

    if (dto.title !== undefined) {
      const title = Title.create(dto.title);
      if (!title.ok) {
        return Err(title.error);
      }
      task.updateTitle(title.value);
    }

    if (dto.description !== undefined) {
      const description = Description.create(dto.description);
      if (!description.ok) {
        return Err(description.error);
      }
      task.updateDescription(description.value);
    }

    if (dto.dueDate !== undefined) {
      const dueDate = DueDate.create(dto.dueDate);
      if (!dueDate.ok) {
        return Err(dueDate.error);
      }
      task.updateDueDate(dueDate.value);
    }

    const saveResult = await this.taskRepository.save(task);
    if (!saveResult.ok) {
      return Err(saveResult.error);
    }

    return Ok(undefined);
  }
}

export interface UpdateTaskDTO {
  taskId: string;
  title?: string;
  description?: string;
  dueDate?: Date;
}
