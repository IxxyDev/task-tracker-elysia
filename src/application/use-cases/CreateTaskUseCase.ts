import { Task } from '@domain/entities/Task';
import type { TaskRepository } from '@domain/repositories/TaskRepository';
import { Description } from '@domain/value-objects/Description';
import { DueDate } from '@domain/value-objects/DueDate';
import type { TaskId } from '@domain/value-objects/TaskId';
import { Title } from '@domain/value-objects/Title';
import { Err, type Result } from '@shared/Result';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(dto: CreateTaskDTO): Promise<Result<TaskId>> {
    const title = Title.create(dto.title);
    if (!title.ok) {
      return Err(title.error);
    }

    const description = Description.create(dto.description ?? '');
    if (!description.ok) {
      return Err(description.error);
    }

    const dueDate = DueDate.create(dto.dueDate);
    if (!dueDate.ok) {
      return Err(dueDate.error);
    }

    const task = Task.create(
      title.value,
      dueDate.value,
      description.value
    )

    const saveResult = await this.taskRepository.save(task);
    if (!saveResult.ok) {
      return Err(saveResult.error);
    }

    return { ok: true, value: task.getId() }
  }
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueDate: Date;
}