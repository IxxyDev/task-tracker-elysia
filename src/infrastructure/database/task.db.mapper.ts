import { Err, Ok, type Result } from '@shared/result.types';
import type { TaskInsert, TaskRow } from './task.db.schema';
import { Task } from '@domain/entities/task.entity';
import { TaskId } from '@domain/valueObjects/taskId.valueObject';
import { Title } from '@domain/valueObjects/title.valueObject';
import { Description } from '@domain/valueObjects/description.valueObject';
import { DueDate } from '@domain/valueObjects/dueDate.valueObject';
import { TaskStatus } from '@domain/valueObjects/taskStatus.valueObject';

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
        status.value,
        row.createdAt,
        row.updatedAt
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
      createdAt: task.getCreatedAt(),
      updatedAt: task.getUpdatedAt(),
    };
  }
}