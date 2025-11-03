import { Ok, Err } from '@shared/Result';
import type { Result } from '@shared/Result';

export class Title {
  private static readonly MAX_LENGTH = 200;

  private constructor(private readonly value: string) {}

  toString(): string {
    return this.value;
  }

  equals(other: Title): boolean {
    return this.value === other.value;
  }

  static create(value: string): Result<Title> {
    const trimmed = value.trim();

    if (!trimmed.length) {
      return Err('Title cannot be empty');
    }

    if (trimmed.length > Title.MAX_LENGTH) {
      return Err('Title cannot exceed 200 characters');
    }

    return Ok(new Title(trimmed));
  }
}