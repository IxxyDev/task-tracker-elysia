import { describe, it, expect, beforeEach } from 'bun:test';
import { DrizzleTaskRepository } from '@infrastructure/database/DrizzleTaskRepository';
import { Task } from '@domain/entities/Task';
import { Title } from '@domain/value-objects/Title';
import { Description } from '@domain/value-objects/Description';
import { DueDate } from '@domain/value-objects/DueDate';
import { TaskId } from '@domain/value-objects/TaskId';
import { TaskStatus } from '@domain/value-objects/TaskStatus';
import { db } from '@infrastructure/database/connection';
import { tasks } from '@infrastructure/database/schema';

describe("DrizzleTaskRepository", () => {
  const _1_DAY = 24 * 60 * 60 * 1000;
  const _12_HOURS = 0.5 * _1_DAY;
  const _2_DAYS = 2 * _1_DAY;
  let repository: DrizzleTaskRepository;

  beforeEach(async () => {
    repository = new DrizzleTaskRepository(db);
    await db.delete(tasks);
  });

  describe("::save", () => {
    it('should save new task', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);

      const result = await repository.save(task);

      expect(result.value).toEqual(undefined);
    });

    it('should update existing task', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);

      await repository.save(task);

      const newTitle = Title.create('Buy vegetables').value!;
      task.updateTitle(newTitle);

      const result = await repository.save(task);

      expect(result.value).toEqual(undefined);

      const foundTask = await repository.findById(task.getId());
      expect(foundTask.value!.getTitle().toString()).toEqual('Buy vegetables');
    });

    it('should save task with description', async () => {
      const title = Title.create('Buy groceries').value!;
      const description = Description.create('Milk and eggs').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate, description);

      const result = await repository.save(task);

      expect(result.value).toEqual(undefined);

      const foundTask = await repository.findById(task.getId());
      expect(foundTask.value!.getDescription().toString()).toEqual('Milk and eggs');
    });
  });

  describe("::findById", () => {
    it('should find task by id', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);

      await repository.save(task);

      const result = await repository.findById(task.getId());

      expect(result.value!.getTitle().toString()).toEqual('Buy groceries');
      expect(result.value!.getStatus()).toEqual(TaskStatus.PENDING);
    });

    it('should return error when task not found', async () => {
      const id = TaskId.fromString('01933eb4-18a2-7123-8abc-123456789abc').value!;

      const result = await repository.findById(id);

      expect(result.error).toEqual('Task not found');
    });
  });

  describe("::findAll", () => {
    it('should return all tasks', async () => {
      const title1 = Title.create('Buy groceries').value!;
      const title2 = Title.create('Clean house').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task1 = Task.create(title1, dueDate);
      const task2 = Task.create(title2, dueDate);

      await repository.save(task1);
      await repository.save(task2);

      const result = await repository.findAll();

      expect(result.value!.length).toEqual(2);
    });

    it('should return empty array when no tasks', async () => {
      const result = await repository.findAll();

      expect(result.value!.length).toEqual(0);
    });
  });

  describe("::delete", () => {
    it('should delete task', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);

      await repository.save(task);

      const result = await repository.delete(task.getId());

      expect(result.value).toEqual(undefined);

      const foundTask = await repository.findById(task.getId());
      expect(foundTask.error).toEqual('Task not found');
    });

    it('should not fail when deleting non-existent task', async () => {
      const id = TaskId.fromString('01933eb4-18a2-7123-8abc-123456789abc').value!;

      const result = await repository.delete(id);

      expect(result.value).toEqual(undefined);
    });
  });

  describe("::findByStatus", () => {
    it('should filter tasks by pending status', async () => {
      const title1 = Title.create('Buy groceries').value!;
      const title2 = Title.create('Clean house').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task1 = Task.create(title1, dueDate);
      const task2 = Task.create(title2, dueDate);
      task2.start();

      await repository.save(task1);
      await repository.save(task2);

      const result = await repository.findByStatus(TaskStatus.PENDING);

      expect(result.value!.length).toEqual(1);
      expect(result.value![0].getTitle().toString()).toEqual('Buy groceries');
    });

    it('should filter tasks by in_progress status', async () => {
      const title1 = Title.create('Buy groceries').value!;
      const title2 = Title.create('Clean house').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task1 = Task.create(title1, dueDate);
      const task2 = Task.create(title2, dueDate);
      task2.start();

      await repository.save(task1);
      await repository.save(task2);

      const result = await repository.findByStatus(TaskStatus.IN_PROGRESS);

      expect(result.value!.length).toEqual(1);
      expect(result.value![0].getTitle().toString()).toEqual('Clean house');
    });

    it('should return empty array when no tasks with status', async () => {
      const title = Title.create('Buy groceries').value!;
      const dueDate = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const task = Task.create(title, dueDate);

      await repository.save(task);

      const result = await repository.findByStatus(TaskStatus.COMPLETED);

      expect(result.value!.length).toEqual(0);
    });
  });

  describe("::findDueSoon", () => {
    it('should find tasks due within 24 hours', async () => {
      const title1 = Title.create('Urgent task').value!;
      const title2 = Title.create('Later task').value!;
      const urgentDate = DueDate.create(new Date(Date.now() + _12_HOURS)).value!;
      const laterDate = DueDate.create(new Date(Date.now() + _2_DAYS)).value!;
      const task1 = Task.create(title1, urgentDate);
      const task2 = Task.create(title2, laterDate);

      await repository.save(task1);
      await repository.save(task2);

      const result = await repository.findDueSoon();

      expect(result.value!.length).toEqual(1);
      expect(result.value![0].getTitle().toString()).toEqual('Urgent task');
    });

    it('should find tasks due within custom threshold', async () => {
      const title1 = Title.create('Task 1').value!;
      const title2 = Title.create('Task 2').value!;
      const date1 = DueDate.create(new Date(Date.now() + _1_DAY)).value!;
      const date2 = DueDate.create(new Date(Date.now() + _2_DAYS)).value!;
      const task1 = Task.create(title1, date1);
      const task2 = Task.create(title2, date2);

      await repository.save(task1);
      await repository.save(task2);

      const result = await repository.findDueSoon(48);

      expect(result.value!.length).toEqual(2);
    });

    it('should return empty array when no tasks due soon', async () => {
      const title = Title.create('Later task').value!;
      const laterDate = DueDate.create(new Date(Date.now() + _2_DAYS)).value!;
      const task = Task.create(title, laterDate);

      await repository.save(task);

      const result = await repository.findDueSoon();

      expect(result.value!.length).toEqual(0);
    });
  });
});
