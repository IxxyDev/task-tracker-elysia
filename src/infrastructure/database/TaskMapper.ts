import { Err, Ok, type Result } from '@shared/Result';
import type { TaskInsert, TaskRow } from './schema';
import { Task } from '@domain/entities/Task';
import { TaskId } from '@domain/value-objects/TaskId';
import { Title } from '@domain/value-objects/Title';
import { Description } from '@domain/value-objects/Description';
import { DueDate } from '@domain/value-objects/DueDate';
import { TaskStatus } from '@domain/value-objects/TaskStatus';

export class TaskMapper {
  static toDomain(row: TaskRow): Result<Task> {
    const id = TaskId.fromString(row.id);
    if (!id.ok) {
      return Err(id.error);
    }

    const title = Title.create(row.title);
    if (!title.ok) {
      return Err(title.error);
    }

    const description = Description.create(row.description);
    if (!description.ok) {
      return Err(description.error);
    }

    const dueDate = DueDate.create(row.dueDate);
    if (!dueDate.ok) {
      return Err(dueDate.error);
    }

    const status = TaskStatus.fromString(row.status);
    if (!status.ok) {
      return Err(status.error);
    }

    return Ok(
      Task.restore(
        id.value,
        title.value,
        description.value,
        dueDate.value,
        status.value
      )
    );
  }

  static toPersistence(task: Task): TaskInsert {
    return {
      id: task.getId().toString(),
      title: task.getTitle().toString(),
      description: task.getDescription().toString(),
      dueDate: task.getDueDate().toDate(),
      status: task.getStatus(),
      updatedAt: new Date(),
    };
  }
}