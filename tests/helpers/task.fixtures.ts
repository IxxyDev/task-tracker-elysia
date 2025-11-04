import { Task } from '@domain/entities/task.entity';
import { TaskId } from '@domain/valueObjects/taskId.valueObject';
import { Title } from '@domain/valueObjects/title.valueObject';
import { Description } from '@domain/valueObjects/description.valueObject';
import { DueDate } from '@domain/valueObjects/dueDate.valueObject';
import { TaskStatus } from '@domain/valueObjects/taskStatus.valueObject';
import { _1_DAY } from './constants';

/**
 * Test fixtures for creating domain objects with sensible defaults
 */

export interface CreateTestTaskOptions {
  title?: string;
  description?: string;
  dueDate?: Date;
  id?: string;
  status?: TaskStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Creates a test Task with default or custom values
 */
export function createTestTask(options: CreateTestTaskOptions = {}): Task {
  const title = Title.create(options.title ?? 'Test Task').value!;
  const description = options.description
    ? Description.create(options.description).value!
    : undefined;
  const dueDate = DueDate.create(options.dueDate ?? new Date(Date.now() + _1_DAY)).value!;

  if (options.id || options.status || options.createdAt || options.updatedAt) {
    // Use restore for full control
    const id = options.id
      ? TaskId.fromString(options.id).value!
      : TaskId.create();
    const status = options.status ?? TaskStatus.PENDING;
    const createdAt = options.createdAt ?? new Date();
    const updatedAt = options.updatedAt ?? new Date();
    const desc = description ?? Description.create('').value!;

    return Task.restore(id, title, desc, dueDate, status, createdAt, updatedAt);
  }

  return Task.create(title, dueDate, description);
}

/**
 * Creates a test Title value object
 */
export function createTestTitle(value: string = 'Test Title'): Title {
  return Title.create(value).value!;
}

/**
 * Creates a test Description value object
 */
export function createTestDescription(value: string = 'Test Description'): Description {
  return Description.create(value).value!;
}

/**
 * Creates a test DueDate value object
 */
export function createTestDueDate(date?: Date): DueDate {
  return DueDate.create(date ?? new Date(Date.now() + _1_DAY)).value!;
}

/**
 * Creates a test TaskId value object
 */
export function createTestTaskId(id?: string): TaskId {
  return id ? TaskId.fromString(id).value! : TaskId.create();
}
