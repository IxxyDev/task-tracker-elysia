import { describe, it, expect, spyOn, beforeEach, afterEach } from 'bun:test';
import { ConsoleNotificationService } from '@infrastructure/notification/ConsoleNotificationService';
import { Task } from '@domain/entities/Task';
import { Title } from '@domain/value-objects/Title';
import { DueDate } from '@domain/value-objects/DueDate';

describe("ConsoleNotificationService", () => {
  let consoleLogSpy: any;

  beforeEach(() => {
    consoleLogSpy = spyOn(console, 'log');
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("::sending task due notifications", () => {
    it('should log task information to console', async () => {
      const service = new ConsoleNotificationService();
      const task = Task.create(
        Title.create('Important Task').value!,
        DueDate.create(new Date('2025-11-03T15:00:00Z')).value!
      );

      await service.sendTaskDueNotification(task);

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should return success result', async () => {
      const service = new ConsoleNotificationService();
      const task = Task.create(
        Title.create('Important Task').value!,
        DueDate.create(new Date('2025-11-03T15:00:00Z')).value!
      );

      const result = await service.sendTaskDueNotification(task);

      expect(result.ok).toEqual(true);
    });

    it('should include task title in log output', async () => {
      const service = new ConsoleNotificationService();
      const task = Task.create(
        Title.create('Important Task').value!,
        DueDate.create(new Date('2025-11-03T15:00:00Z')).value!
      );

      await service.sendTaskDueNotification(task);

      const logCalls = consoleLogSpy.mock.calls;
      const allLogs = logCalls.map((call: any) => call.join(' ')).join('\n');

      expect(allLogs).toContain('Important Task');
    });

    it('should include task ID in log output', async () => {
      const service = new ConsoleNotificationService();
      const task = Task.create(
        Title.create('Important Task').value!,
        DueDate.create(new Date('2025-11-03T15:00:00Z')).value!
      );

      await service.sendTaskDueNotification(task);

      const logCalls = consoleLogSpy.mock.calls;
      const allLogs = logCalls.map((call: any) => call.join(' ')).join('\n');

      expect(allLogs).toContain(task.getId().toString());
    });

    it('should include task status in log output', async () => {
      const service = new ConsoleNotificationService();
      const task = Task.create(
        Title.create('Important Task').value!,
        DueDate.create(new Date('2025-11-03T15:00:00Z')).value!
      );

      await service.sendTaskDueNotification(task);

      const logCalls = consoleLogSpy.mock.calls;
      const allLogs = logCalls.map((call: any) => call.join(' ')).join('\n');

      expect(allLogs).toContain('pending');
    });
  });
});
