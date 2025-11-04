import { describe, it, expect } from "bun:test";
import { Title } from "@domain/valueObjects/title.valueObject";

describe("Title", () => {
  describe("::create", () => {
    it("should create valid title", () => {
      const result = Title.create("Buy groceries");

      expect(result.value!.toString()).toEqual("Buy groceries");
    });

    it("should trim whitespace", () => {
      const result = Title.create("  Buy groceries  ");

      expect(result.value!.toString()).toEqual("Buy groceries");
    });

    it("should reject empty title", () => {
      const result = Title.create("");

      expect(result.error).toEqual("Title cannot be empty");
    });

    it("should reject whitespace-only title", () => {
      const result = Title.create("   ");

      expect(result.error).toEqual("Title cannot be empty");
    });

    it("should reject title exceeding 200 characters", () => {
      const longTitle = "a".repeat(201);

      const result = Title.create(longTitle);

      expect(result.error).toEqual("Title cannot exceed 200 characters");
    });

    it("should accept title at max length", () => {
      const maxTitle = "a".repeat(200);

      const result = Title.create(maxTitle);

      expect(result.value!.toString()).toEqual(maxTitle);
    });
  });

  describe("::compare", () => {
    it("should identify same title", () => {
      const title1 = Title.create("Buy groceries");
      const title2 = Title.create("Buy groceries");

      expect(title1.value!.equals(title2.value!)).toEqual(true);
    });

    it("should identify different titles", () => {
      const title1 = Title.create("Buy groceries");
      const title2 = Title.create("Clean house");

      expect(title1.value!.equals(title2.value!)).toEqual(false);
    });
  });
});
