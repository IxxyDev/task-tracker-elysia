import { describe, it, expect } from "bun:test";
import { TaskId } from "@domain/valueObjects/taskId.valueObject"

describe("TaskId", () => {
  const uuid = "01933eb4-18a2-7123-8abc-123456789abc";
  const anotherUuid = "01933eb4-18a2-7456-9def-987654321fed";

  describe("::create", () => {
    it('should generate unique id automatically', () => {
      const taskId = TaskId.create()

      expect(taskId.toString()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('should generate different ids for different tasks', () => {
      const taskId1 = TaskId.create();
      const taskId2 = TaskId.create();

      expect(taskId1.equals(taskId2)).toBe(false);
    })
  })

  describe('::load', () => {
    it('should restore task from valid uuid', () => {
      const result = TaskId.fromString(uuid);

      expect(result.value!.toString()).toBe(uuid);
    });

    it('should reject if uuid is invalid', () => {
      const invalidUuid = 'not-a-uuid';

      const result = TaskId.fromString(invalidUuid);

      expect(result.ok).toBe(false);
    })

    it("should reject if empty uuid", () => {
      const emptyString = "";

      const result = TaskId.fromString(emptyString);

      expect(result.ok).toBe(false);
    });
  });

  describe("::compare", () => {
    it('should recognize same task', () => {
      const taskId1Result = TaskId.fromString(uuid);
      const taskId2Result = TaskId.fromString(uuid);

      expect(taskId1Result.value!.equals(taskId2Result.value!)).toBe(true);
    })

    it('should recognize different tasks', () => {
      const taskId1Result = TaskId.fromString(uuid);
      const taskId2Result = TaskId.fromString(anotherUuid);

      expect(taskId1Result.value!.equals(taskId2Result.value!)).toBe(false);
    })
  })
})