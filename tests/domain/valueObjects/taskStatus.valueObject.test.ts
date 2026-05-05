import { describe, it, expect } from "bun:test";
import { TaskStatus } from "@domain/valueObjects/taskStatus.valueObject";

describe("TaskStatus", () => {
  describe("::creating task", () => {
    it("should create with pending status by default", () => {
      const status: string = TaskStatus.PENDING;

      expect(status).toBe("pending");
    });

    it("should have all valid statuses available", () => {
      expect<string>(TaskStatus.PENDING).toBe("pending");
      expect<string>(TaskStatus.IN_PROGRESS).toBe("in_progress");
      expect<string>(TaskStatus.COMPLETED).toBe("completed");
      expect<string>(TaskStatus.CANCELLED).toBe("cancelled");
    });
  });

  describe("::parsing status from string", () => {
    it("should parse valid pending status", () => {
      const result = TaskStatus.fromString("pending");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(TaskStatus.PENDING);
      }
    });

    it("should parse valid in_progress status", () => {
      const result = TaskStatus.fromString("in_progress");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(TaskStatus.IN_PROGRESS);
      }
    });

    it("should parse valid completed status", () => {
      const result = TaskStatus.fromString("completed");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(TaskStatus.COMPLETED);
      }
    });

    it("should parse valid cancelled status", () => {
      const result = TaskStatus.fromString("cancelled");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(TaskStatus.CANCELLED);
      }
    });

    it("should reject invalid status", () => {
      const result = TaskStatus.fromString("invalid-status");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Invalid task status");
      }
    });

    it("should reject empty string", () => {
      const result = TaskStatus.fromString("");

      expect(result.ok).toBe(false);
    });

    it("should handle case-insensitive parsing", () => {
      const result = TaskStatus.fromString("PENDING");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(TaskStatus.PENDING);
      }
    });
  });

  describe("::checking status", () => {
    it("should identify completed task", () => {
      const status = TaskStatus.COMPLETED;

      expect(TaskStatus.isCompleted(status)).toBe(true);
      expect(TaskStatus.isActive(status)).toBe(false);
    });

    it("should identify active task", () => {
      const status = TaskStatus.IN_PROGRESS;

      expect(TaskStatus.isActive(status)).toBe(true);
      expect(TaskStatus.isCompleted(status)).toBe(false);
    });

    it("should identify cancelled task as not active", () => {
      const status = TaskStatus.CANCELLED;

      expect(TaskStatus.isActive(status)).toBe(false);
      expect(TaskStatus.isCompleted(status)).toBe(false);
    });
  });
});
