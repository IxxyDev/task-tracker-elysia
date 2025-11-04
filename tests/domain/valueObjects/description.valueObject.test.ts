import { describe, it, expect } from 'bun:test';
import { Description } from '@domain/valueObjects/description.valueObject';

describe("Description", () => {
  describe("::create", () => {
    it('should create valid description', () => {
      const result = Description.create('Need to buy milk, eggs, and bread');

      expect(result.value!.toString()).toEqual('Need to buy milk, eggs, and bread');
    });

    it('should trim whitespace', () => {
      const result = Description.create('  Important task  ');

      expect(result.value!.toString()).toEqual('Important task');
    });

    it('should reject description exceeding 1000 characters', () => {
      const longDesc = 'a'.repeat(1001);

      const result = Description.create(longDesc);

      expect(result.error).toEqual('Description cannot exceed 1000 characters');
    });

    it('should accept description at max length', () => {
      const maxDesc = 'a'.repeat(1000);

      const result = Description.create(maxDesc);

      expect(result.value!.toString()).toEqual(maxDesc);
    });
  });

  describe("::compare", () => {
    it('should identify same description', () => {
      const desc1 = Description.create('Important task');
      const desc2 = Description.create('Important task');

      expect(desc1.value!.equals(desc2.value!)).toEqual(true);
    });

    it('should identify different descriptions', () => {
      const desc1 = Description.create('Important task');
      const desc2 = Description.create('Another task');

      expect(desc1.value!.equals(desc2.value!)).toEqual(false);
    });
  });

  describe("::check", () => {
    it('should identify empty description', () => {
      const desc = Description.create('');

      expect(desc.value!.isEmpty()).toEqual(true);
    });

    it('should identify non-empty description', () => {
      const desc = Description.create('Important task');

      expect(desc.value!.isEmpty()).toEqual(false);
    });
  });
});
