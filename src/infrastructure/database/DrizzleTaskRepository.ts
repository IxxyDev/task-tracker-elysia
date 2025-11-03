import type { Task } from '@domain/entities/Task';
import type { TaskRepository } from '@domain/repositories/TaskRepository';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { TaskMapper } from './TaskMapper';
import { Err, Ok, type Result } from '@shared/Result';
import { tasks } from './schema';
import type { TaskId } from '@domain/value-objects/TaskId';
import type { TaskStatus } from '@domain/value-objects/TaskStatus';
import { eq, lte } from 'drizzle-orm';

export class DrizzleTaskRepository implements TaskRepository {
  constructor(private readonly db: PostgresJsDatabase) {}

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

      const taskResults = rows.map((row) => TaskMapper.toDomain(row));

      const taskList: Task[] = [];
      for (const result of taskResults) {
        if (!result.ok) {
          return Err(result.error);
        }
        taskList.push(result.value);
      }

      return Ok(taskList);
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

      const taskResults = rows.map((row) => TaskMapper.toDomain(row));

      const taskList: Task[] = [];
      for (const result of taskResults) {
        if (!result.ok) {
          return Err(result.error);
        }
        taskList.push(result.value);
      }

      return Ok(taskList);
    } catch (error) {
      return Err(`Failed to find tasks by status: ${error}`);
    }
  }

  async findDueSoon(hoursThreshold: number = 24): Promise<Result<Task[]>> {
    try {
      const thresholdDate = new Date(
        Date.now() + hoursThreshold * 60 * 60 * 1000
      );

      const rows = await this.db
        .select()
        .from(tasks)
        .where(lte(tasks.dueDate, thresholdDate));

      const taskResults = rows.map((row) => TaskMapper.toDomain(row));

      const taskList: Task[] = [];
      for (const result of taskResults) {
        if (!result.ok) {
          return Err(result.error);
        }
        taskList.push(result.value);
      }

      return Ok(taskList);
    } catch (error) {
      return Err(`Failed to find due soon tasks: ${error}`);
    }
  }
}