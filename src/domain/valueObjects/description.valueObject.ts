import { Ok, Err } from '@shared/result.types';
import type { Result } from '@shared/result.types';

export class Description {
  static readonly MAX_LENGTH = 1000;

  private constructor(private readonly value: string) {}

  toString(): string {
    return this.value;
  }

  equals(other: Description): boolean {
    return this.value === other.value;
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  static create(value: string): Result<Description> {
    const trimmed = value.trim();

    if (trimmed.length > Description.MAX_LENGTH) {
      return Err(`Description cannot exceed ${this.MAX_LENGTH} characters`);
    }

    return Ok(new Description(trimmed));
  }
}