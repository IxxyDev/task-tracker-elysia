import { Err, Ok } from '@shared/Result';
import type { Result } from '@shared/Result';

export class DueDate {
  private static readonly MS_PER_HOUR = 60 * 60 * 1000;

  private constructor(private readonly value: Date) {}

  toDate(): Date {
    return new Date(this.value.getTime());
  }

  equals(other: DueDate): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  isApproaching(hoursThreshold: number = 24): boolean {
    const now = Date.now();
    const dueTime = this.value.getTime();
    const thresholdMs = hoursThreshold * DueDate.MS_PER_HOUR;

    return dueTime - now <= thresholdMs;
  }

  static create(date: Date): Result<DueDate> {
    if (date.getTime() < Date.now()) {
      return Err('Due date cannot be in the past');
    }

    return Ok(new DueDate(date));
  }

  static fromString(isoString: string): Result<DueDate> {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      return Err('Invalid date format');
    }

    return DueDate.create(date);
  }
}