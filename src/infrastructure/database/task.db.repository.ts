import type { Task } from '@domain/entities/task.entity';
import type { TaskRepository } from '@domain/repositories/task.repository';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { TaskMapper } from './task.db.mapper';
import { Err, Ok, type Result } from '@shared/result.types';
import { tasks, type TaskRow } from './task.db.schema';
import type { TaskId } from '@domain/valueObjects/taskId.valueObject';
import type { TaskStatus } from '@domain/valueObjects/taskStatus.valueObject';
import { eq, lte } from 'drizzle-orm';

export class DrizzleTaskRepository implements TaskRepository {
  constructor(private readonly db: PostgresJsDatabase) {}

  private mapRowsToTasks(rows: TaskRow[]): Result<Task[]> {
    const taskResults = rows.map((row) => TaskMapper.toDomain(row));

    const taskList: Task[] = [];
    for (const result of taskResults) {
      if (!result.ok) {
        return Err(result.error);
      }
      taskList.push(result.value);
    }

    return Ok(taskList);
  }

  async save(task: Task): Promise<Result<void>> {
    try {
      const data = TaskMapper.toPersistence(task);

      await this.db
        .insert(tasks)
        .values(data)
        .onConflictDoUpdate({
          target: tasks.id,
          set: {
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            status: data.status,
            updatedAt: data.updatedAt,
          },
        });

      return Ok(undefined);
    } catch (error) {
      return Err(`Failed to save task: ${error}`);
    }
  }

  async findById(id: TaskId): Promise<Result<Task>> {
    try {
      const rows = await this.db
        .select()
        .from(tasks)
        .where(eq(tasks.id, id.toString()))
        .limit(1);

      if (!rows.length) {
        return Err('Task not found');
      }

      return TaskMapper.toDomain(rows[0]!);
    } catch (error) {
      return Err(`Failed to find task: ${error}`);
    }
  }

  async findAll(): Promise<Result<Task[]>> {
    try {
      const rows = await this.db.select().from(tasks);
      return this.mapRowsToTasks(rows);
    } catch (error) {
      return Err(`Failed to find all tasks: ${error}`);
    }
  }

  async delete(id: TaskId): Promise<Result<void>> {
    try {
      await this.db.delete(tasks).where(eq(tasks.id, id.toString()));

      return Ok(undefined);
    } catch (error) {
      return Err(`Failed to delete task: ${error}`);
    }
  }

  async findByStatus(status: TaskStatus): Promise<Result<Task[]>> {
    try {
      const rows = await this.db
        .select()
        .from(tasks)
        .where(eq(tasks.status, status));

      return this.mapRowsToTasks(rows);
    } catch (error) {
      return Err(`Failed to find tasks by status: ${error}`);
    }
  }

  async findDueSoon(hoursThreshold: number = 24): Promise<Result<Task[]>> {
    try {
      const MS_PER_HOUR = 60 * 60 * 1000;
      const thresholdDate = new Date(Date.now() + hoursThreshold * MS_PER_HOUR);

      const rows = await this.db
        .select()
        .from(tasks)
        .where(lte(tasks.dueDate, thresholdDate));

      return this.mapRowsToTasks(rows);
    } catch (error) {
      return Err(`Failed to find due soon tasks: ${error}`);
    }
  }
}