import { TaskId } from '@domain/value-objects/TaskId';
import { Title } from '@domain/value-objects/Title';
import { Description } from '@domain/value-objects/Description';
import { DueDate } from '@domain/value-objects/DueDate';
import { TaskStatus } from '@domain/value-objects/TaskStatus';
import { Ok, Err } from '@shared/Result';
import type { Result } from '@shared/Result';

export class Task {
  private constructor(
    private readonly id: TaskId,
    private title: Title,
    private description: Description,
    private dueDate: DueDate,
    private status: TaskStatus
  ) {}

  static create(
    title: Title,
    dueDate: DueDate,
    description?: Description
  ): Task {
    return new Task(
      TaskId.create(),
      title,
      description ?? Description.create('').value!,
      dueDate,
      TaskStatus.PENDING
    )
  }

  static restore(
    id: TaskId,
    title: Title,
    description: Description,
    dueDate: DueDate,
    status: TaskStatus
  ): Task {
    return new Task(id, title, description, dueDate, status);
  }

  start(): Result<void> {
    this.status = TaskStatus.IN_PROGRESS;
    return Ok(undefined);
  }

  complete(): Result<void> {
    if (TaskStatus.isCancelled(this.status)) {
      return Err("Cannot complete a cancelled task");
    }

    this.status = TaskStatus.COMPLETED;
    return Ok(undefined);
  }

  cancel(): Result<void> {
    if (TaskStatus.isCompleted(this.status)) {
      return Err("Cannot cancel a completed task");
    }

    this.status = TaskStatus.CANCELLED;
    return Ok(undefined);
  }

  updateTitle(title: Title): void {
    this.title = title;
  }

  updateDescription(description: Description): void {
    this.description = description;
  }

  updateDueDate(dueDate: DueDate): void {
    this.dueDate = dueDate;
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

  isActive(): boolean {
    return TaskStatus.isActive(this.status);
  }

  isDueSoon(hoursThreshold: number = 24): boolean {
    return this.dueDate.isApproaching(hoursThreshold);
  }
}