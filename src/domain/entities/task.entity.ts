import { TaskId } from '@domain/valueObjects/taskId.valueObject';
import { Title } from '@domain/valueObjects/title.valueObject';
import { Description } from '@domain/valueObjects/description.valueObject';
import { DueDate } from '@domain/valueObjects/dueDate.valueObject';
import { TaskStatus } from '@domain/valueObjects/taskStatus.valueObject';
import { Ok, Err } from '@shared/result.types';
import type { Result } from '@shared/result.types';

export class Task {
  private constructor(
    private readonly id: TaskId,
    private title: Title,
    private description: Description,
    private dueDate: DueDate,
    private status: TaskStatus,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  static create(
    title: Title,
    dueDate: DueDate,
    description?: Description
  ): Task {
    const now = new Date();
    return new Task(
      TaskId.create(),
      title,
      description ?? Description.create('').value!,
      dueDate,
      TaskStatus.PENDING,
      now,
      now
    )
  }

  static restore(
    id: TaskId,
    title: Title,
    description: Description,
    dueDate: DueDate,
    status: TaskStatus,
    createdAt: Date,
    updatedAt: Date
  ): Task {
    return new Task(id, title, description, dueDate, status, createdAt, updatedAt);
  }

  executeAction(action: string): Result<void> {
    const actions: Record<string, () => Result<void>> = {
      start: () => this.start(),
      complete: () => this.complete(),
      cancel: () => this.cancel(),
    };

    const actionFn = actions[action];
    if (!actionFn) {
      return Err('Invalid action');
    }

    return actionFn();
  }

  start(): Result<void> {
    this.status = TaskStatus.IN_PROGRESS;
    this.updatedAt = new Date();
    return Ok(undefined);
  }

  complete(): Result<void> {
    if (TaskStatus.isCancelled(this.status)) {
      return Err("Cannot complete a cancelled task");
    }

    this.status = TaskStatus.COMPLETED;
    this.updatedAt = new Date();
    return Ok(undefined);
  }

  cancel(): Result<void> {
    if (TaskStatus.isCompleted(this.status)) {
      return Err("Cannot cancel a completed task");
    }

    this.status = TaskStatus.CANCELLED;
    this.updatedAt = new Date();
    return Ok(undefined);
  }

  updateTitle(title: Title): void {
    this.title = title;
    this.updatedAt = new Date();
  }

  updateDescription(description: Description): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  updateDueDate(dueDate: DueDate): void {
    this.dueDate = dueDate;
    this.updatedAt = new Date();
  }

  getId(): TaskId {
    return this.id;
  }

  getTitle(): Title {
    return this.title;
  }

  getDescription(): Description {
    return this.description;
  }

  getDueDate(): DueDate {
    return this.dueDate;
  }

  getStatus(): TaskStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  isActive(): boolean {
    return TaskStatus.isActive(this.status);
  }

  isDueSoon(hoursThreshold: number = 24): boolean {
    return this.dueDate.isApproaching(hoursThreshold);
  }
}