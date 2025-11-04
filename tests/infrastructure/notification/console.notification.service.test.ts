import { describe, it, expect, spyOn, beforeEach, afterEach } from 'bun:test';
import { ConsoleNotificationService } from '@infrastructure/notification/console.notification.service';
import { createTestTask } from '@tests/helpers/task.fixtures';

describe("ConsoleNotificationService", () => {
  let consoleLogSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    consoleLogSpy = spyOn(console, 'log');
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("::sending task due notifications", () => {
    it('should log task information to console', async () => {
      const service = new ConsoleNotificationService();
      const task = createTestTask({
        title: 'Important Task',
        dueDate: new Date('2025-11-03T15:00:00Z')
      });

      await service.sendTaskDueNotification(task);

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should return success result', async () => {
      const service = new ConsoleNotificationService();
      const task = createTestTask({
        title: 'Important Task',
        dueDate: new Date('2025-11-03T15:00:00Z')
      });

      const result = await service.sendTaskDueNotification(task);

      expect(result.ok).toEqual(true);
    });

    it('should include task title in log output', async () => {
      const service = new ConsoleNotificationService();
      const task = createTestTask({
        title: 'Important Task',
        dueDate: new Date('2025-11-03T15:00:00Z')
      });

      await service.sendTaskDueNotification(task);

      const logCalls = consoleLogSpy.mock.calls;
      const allLogs = logCalls.map((call: unknown[]) => call.join(' ')).join('\n');

      expect(allLogs).toContain('Important Task');
    });

    it('should include task ID in log output', async () => {
      const service = new ConsoleNotificationService();
      const task = createTestTask({
        title: 'Important Task',
        dueDate: new Date('2025-11-03T15:00:00Z')
      });

      await service.sendTaskDueNotification(task);

      const logCalls = consoleLogSpy.mock.calls;
      const allLogs = logCalls.map((call: unknown[]) => call.join(' ')).join('\n');

      expect(allLogs).toContain(task.getId().toString());
    });

    it('should include task status in log output', async () => {
      const service = new ConsoleNotificationService();
      const task = createTestTask({
        title: 'Important Task',
        dueDate: new Date('2025-11-03T15:00:00Z')
      });

      await service.sendTaskDueNotification(task);

      const logCalls = consoleLogSpy.mock.calls;
      const allLogs = logCalls.map((call: unknown[]) => call.join(' ')).join('\n');

      expect(allLogs).toContain('pending');
    });
  });
});
