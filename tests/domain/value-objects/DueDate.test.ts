import { describe, it, expect } from 'bun:test';
import { DueDate } from '@domain/value-objects/DueDate';

describe("DueDate", () => {
  const _1_DAY = 24 * 60 * 60 * 1000;
  const _2_DAYS = 2 * _1_DAY;
  const _12_HOURS = 0.5 * _1_DAY;
  const _3_MINUTES = 30 * 60 * 100;

  describe("::create", () => {
    it("should create from future date", () => {
      const futureDate = new Date(Date.now() + _1_DAY);

      const result = DueDate.create(futureDate);

      expect(result.value!.toDate().getTime()).toEqual(futureDate.getTime());
    })

    it('should create from ISO string', () => {
      const futureDate = new Date(Date.now() + _1_DAY);
      const isoString = futureDate.toISOString();

      const result = DueDate.fromString(isoString);

      expect(result.value!.toDate().getTime()).toEqual(futureDate.getTime());
    })

    it('should reject past date', () => {
      const pastDate = new Date(Date.now() - _1_DAY);

      const result = DueDate.create(pastDate);

      expect(result.error).toEqual("Due date cannot be in the past");
    })

    it('should reject invalid date string', () => {
      const result = DueDate.fromString('invalid-date');

      expect(result.error).toEqual('Invalid date format');
    })
  })

  describe("::urgency", () => {
    it('should identify approaching deadline within 24 hours', () => {
      const approachingDate = new Date(Date.now() + _12_HOURS);

      const result = DueDate.create(approachingDate);

      expect(result.value!.isApproaching()).toEqual(true);
    })

    it('should identify non-urgent deadline beyond 24 hours', () => {
      const distantDate = new Date(Date.now() + _2_DAYS);

      const result = DueDate.create(distantDate);

      expect(result.value!.isApproaching()).toEqual(false);
    })

    it('should identify immediate deadline within 1 hour', () => {
      const immediateDate = new Date(Date.now() + _3_MINUTES);

      const result = DueDate.create(immediateDate);

      expect(result.value!.isApproaching(1)).toEqual(true);
    })

    it('should handle custom hour threshold', () => {
      const date = new Date(Date.now() + _1_DAY + _12_HOURS);

      const result = DueDate.create(date);

      expect(result.value!.isApproaching(48)).toEqual(true);
      expect(result.value!.isApproaching(24)).toEqual(false);
    })
  })

  describe('::compare', () => {
    it('should identify same due date', () => {
      const date = new Date(Date.now() + _1_DAY);

      const result1 = DueDate.create(date);
      const result2 = DueDate.create(date);

      expect(result1.value!.equals(result2.value!)).toEqual(true);
    })

    it("should identify different due dates", () => {
      const date1 = new Date(Date.now() + _1_DAY);
      const date2 = new Date(Date.now() + _2_DAYS);

      const result1 = DueDate.create(date1);
      const result2 = DueDate.create(date2);

      expect(result1.value!.equals(result2.value!)).toEqual(false);
    });
  })
})