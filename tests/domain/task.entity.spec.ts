import { describe, it, expect } from 'bun:test';
import { Task } from '@domain/entities/task.entity';
import { Title } from '@domain/valueObjects/title.valueObject';
import { Description } from '@domain/valueObjects/description.valueObject';
import { DueDate } from '@domain/valueObjects/dueDate.valueObject';
import { TaskStatus } from '@domain/valueObjects/taskStatus.valueObject';

describe("Task", () => {
  const _1_DAY = 24 * 60 * 60 * 1000;
  const _2_DAYS = 2 * _1_DAY;
  const _12_HOURS = 0.5 * _1_DAY;

  describe("::create", () => {
    it('should create task with title and due date', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;

      const task = Task.create(title, dueDate);

      expect(task.getTitle().toString()).toEqual('Buy groceries');
      expect(task.getStatus()).toEqual(TaskStatus.PENDING);
    });

    it('should create task with description', () => {
      const title = Title.create('Buy groceries').value!;
      const description = Description.create('Milk and eggs').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;

      const task = Task.create(title, dueDate, description);

      expect(task.getDescription().toString()).toEqual('Milk and eggs');
    });

    it('should create task without description', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;

      const task = Task.create(title, dueDate);

      expect(task.getDescription().isEmpty()).toEqual(true);
    });
  });

  describe("::status transitions", () => {
    it('should start pending task', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);

      const result = task.start();

      expect(result.ok).toEqual(true);
      expect(task.getStatus()).toEqual(TaskStatus.IN_PROGRESS);
    });

    it('should complete in-progress task', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);
      task.start();

      const result = task.complete();

      expect(result.ok).toEqual(true);
      expect(task.getStatus()).toEqual(TaskStatus.COMPLETED);
    });

    it('should cancel pending task', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);

      const result = task.cancel();

      expect(result.ok).toEqual(true);
      expect(task.getStatus()).toEqual(TaskStatus.CANCELLED);
    });

    it('should reject completing cancelled task', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);
      task.cancel();

      const result = task.complete();

      expect(result.ok).toEqual(false);
      expect(result.error).toEqual('Cannot complete a cancelled task');
    });

    it('should reject cancelling completed task', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);
      task.start();
      task.complete();

      const result = task.cancel();

      expect(result.ok).toEqual(false);
      expect(result.error).toEqual('Cannot cancel a completed task');
    });
  });

  describe("::updates", () => {
    it('should update title', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);
      const newTitle = Title.create('Buy vegetables').value!;

      task.updateTitle(newTitle);

      expect(task.getTitle().toString()).toEqual('Buy vegetables');
    });

    it('should update description', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);
      const newDesc = Description.create('Organic products only').value!;

      task.updateDescription(newDesc);

      expect(task.getDescription().toString()).toEqual('Organic products only');
    });

    it('should update due date', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);
      const newDueDate = DueDate.create(new Date(Date.now() + _2_DAYS)).value!;

      task.updateDueDate(newDueDate);

      expect(task.getDueDate().equals(newDueDate)).toEqual(true);
    });
  });

  describe("::checks", () => {
    it('should identify active task', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);

      expect(task.isActive()).toEqual(true);
    });

    it('should identify completed task as not active', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);
      task.start();
      task.complete();

      expect(task.isActive()).toEqual(false);
    });

    it('should identify task with approaching deadline', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _12_HOURS)).value!;
      const task = Task.create(title, dueDate);

      expect(task.isDueSoon()).toEqual(true);
    });

    it('should identify task with distant deadline', () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _2_DAYS)).value!;
      const task = Task.create(title, dueDate);

      expect(task.isDueSoon()).toEqual(false);
    });
  });
});
