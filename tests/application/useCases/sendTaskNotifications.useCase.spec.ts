import { describe, it, expect } from 'bun:test';
import { SendTaskNotificationsUseCase } from '@application/useCases/sendTaskNotifications.useCase';
import type { TaskRepository } from '@domain/repositories/task.repository';
import type { NotificationService } from '@application/ports/notification.service.interface';
import { Task } from '@domain/entities/task.entity';
import { Title } from '@domain/valueObjects/title.valueObject';
import { DueDate } from '@domain/valueObjects/dueDate.valueObject';
import { Ok, Err } from '@shared/result.types';

const _2_HOURS = 2 * 60 * 60 * 1000;
const _5_HOURS = 5 * 60 * 60 * 1000;
const _12_HOURS = 12;

class MockTaskRepository implements TaskRepository {
  private mockFindDueSoon: any;

  setFindDueSoon(fn: any) {
    this.mockFindDueSoon = fn;
  }

  async findDueSoon(hoursThreshold?: number) {
    return this.mockFindDueSoon(hoursThreshold);
  }

  async save() {
    return Ok(undefined);
  }

  async findById() {
    return Err('Not implemented');
  }

  async findAll() {
    return Ok([]);
  }

  async delete() {
    return Ok(undefined);
  }

  async findByStatus() {
    return Ok([]);
  }
}

class MockNotificationService implements NotificationService {
  private mockSend: any;
  public sentTasks: Task[] = [];

  setMockSend(fn: any) {
    this.mockSend = fn;
  }

  async sendTaskDueNotification(task: Task) {
    this.sentTasks.push(task);
    return this.mockSend(task);
  }
}

describe("SendTaskNotificationsUseCase", () => {
  describe("::sending notifications for due soon tasks", () => {
    it('should send notifications for all due soon tasks', async () => {
      const mockRepo = new MockTaskRepository();
      const mockNotificationService = new MockNotificationService();
      const useCase = new SendTaskNotificationsUseCase(mockRepo, mockNotificationService);

      const task1 = Task.create(
        Title.create('Task 1').value!,
        DueDate.create(new Date(Date.now() + _2_HOURS)).value!
      );
      const task2 = Task.create(
        Title.create('Task 2').value!,
        DueDate.create(new Date(Date.now() + _5_HOURS)).value!
      );

      mockRepo.setFindDueSoon(() => Ok([task1, task2]));
      mockNotificationService.setMockSend(() => Ok(undefined));

      const result = await useCase.execute();

      expect(result.ok).toEqual(true);
      expect(mockNotificationService.sentTasks.length).toEqual(2);
    });

    it('should use provided threshold parameter', async () => {
      const mockRepo = new MockTaskRepository();
      const mockNotificationService = new MockNotificationService();
      const useCase = new SendTaskNotificationsUseCase(mockRepo, mockNotificationService);

      let capturedThreshold: number | undefined;
      mockRepo.setFindDueSoon((threshold: number | undefined) => {
        capturedThreshold = threshold;
        return Ok([]);
      });

      await useCase.execute(_12_HOURS);

      expect(capturedThreshold).toEqual(_12_HOURS);
    });

    it('should succeed when no tasks are due soon', async () => {
      const mockRepo = new MockTaskRepository();
      const mockNotificationService = new MockNotificationService();
      const useCase = new SendTaskNotificationsUseCase(mockRepo, mockNotificationService);

      mockRepo.setFindDueSoon(() => Ok([]));

      const result = await useCase.execute();

      expect(result.ok).toEqual(true);
      expect(mockNotificationService.sentTasks.length).toEqual(0);
    });
  });

  describe("::error handling", () => {
    it('should return error when repository fails', async () => {
      const mockRepo = new MockTaskRepository();
      const mockNotificationService = new MockNotificationService();
      const useCase = new SendTaskNotificationsUseCase(mockRepo, mockNotificationService);

      mockRepo.setFindDueSoon(() => Err('Database connection failed'));

      const result = await useCase.execute();

      expect(result.ok).toEqual(false);
      if (!result.ok) {
        expect(result.error).toEqual('Database connection failed');
      }
    });

    it('should return error when notification fails', async () => {
      const mockRepo = new MockTaskRepository();
      const mockNotificationService = new MockNotificationService();
      const useCase = new SendTaskNotificationsUseCase(mockRepo, mockNotificationService);

      const task = Task.create(
        Title.create('Task 1').value!,
        DueDate.create(new Date(Date.now() + _2_HOURS)).value!
      );

      mockRepo.setFindDueSoon(() => Ok([task]));
      mockNotificationService.setMockSend(() => Err('Notification service unavailable'));

      const result = await useCase.execute();

      expect(result.ok).toEqual(false);
      if (!result.ok) {
        expect(result.error).toEqual('Notification service unavailable');
      }
    });
  });
});
