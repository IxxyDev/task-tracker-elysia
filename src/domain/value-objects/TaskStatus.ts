import { Ok, Err } from '@shared/Result';
import type { Result } from '@shared/Result';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export namespace TaskStatus {
  export function fromString(value: string): Result<TaskStatus> {
    const normalized = value.toLowerCase().trim();

    switch (normalized) {
      case 'pending':
        return Ok(TaskStatus.PENDING);
      case 'in_progress':
        return Ok(TaskStatus.IN_PROGRESS);
      case 'completed':
        return Ok(TaskStatus.COMPLETED);
      case 'cancelled':
        return Ok(TaskStatus.CANCELLED);
      default:
        return Err('Invalid task status');
    }
  }

  export function isCompleted(status: TaskStatus): boolean {
    return status === TaskStatus.COMPLETED;
  }

  export function isActive(status: TaskStatus): boolean {
    return status === TaskStatus.PENDING || status === TaskStatus.IN_PROGRESS;
  }

  export function isCancelled(status: TaskStatus): boolean {
    return status === TaskStatus.CANCELLED;
  }
}