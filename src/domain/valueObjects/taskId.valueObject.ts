import { randomUUIDv7 } from 'bun';
import type { Result } from '@shared/result.types';
import { Ok, Err } from '@shared/result.types';

export class TaskId {
  static readonly UUID_V7_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  private constructor(private readonly value: string) {}

  toString(): string {
    return this.value;
  }

  equals(other: TaskId): boolean {
    return this.value === other.value;
  }

  static create(): TaskId {
    return new TaskId(randomUUIDv7());
  }

  static fromString(value: string): Result<TaskId> {
    if (!TaskId.UUID_V7_REGEX.test(value)) {
      return Err('Invalid TaskId format')
    }

    return Ok(new TaskId(value));
  }
}