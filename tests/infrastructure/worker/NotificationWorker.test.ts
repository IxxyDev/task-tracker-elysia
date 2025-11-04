import { describe, it, expect, beforeEach } from 'bun:test';
import { NotificationWorker } from '@infrastructure/worker/NotificationWorker';
import type { SendTaskNotificationsUseCase } from '@application/use-cases/SendTaskNotificationsUseCase';
import { Ok, Err } from '@shared/Result';

const _1_MINUTE_MS = 60000;
const _24_HOURS = 24;
const _12_HOURS = 12;
const _50_MS = 50;
const _100_MS = 100;
const _120_MS = 120;
const _200_MS = 200;

class MockSendTaskNotificationsUseCase {
  public executeCalls: Array<{ threshold?: number }> = [];
  private mockExecute: any;

  setMockExecute(fn: any) {
    this.mockExecute = fn;
  }

  async execute(hoursThreshold?: number) {
    this.executeCalls.push({ threshold: hoursThreshold });
    return this.mockExecute ? this.mockExecute(hoursThreshold) : Ok(undefined);
  }
}

describe("NotificationWorker", () => {
  let mockUseCase: MockSendTaskNotificationsUseCase;

  beforeEach(() => {
    mockUseCase = new MockSendTaskNotificationsUseCase();
  });

  describe("::starting and stopping", () => {
    it('should execute use case immediately on start', async () => {
      const worker = new NotificationWorker(
        mockUseCase as unknown as SendTaskNotificationsUseCase,
        _1_MINUTE_MS,
        _24_HOURS
      );

      await worker.start();

      expect(mockUseCase.executeCalls.length).toBeGreaterThanOrEqual(1);

      worker.stop();
    });

    it('should use configured threshold', async () => {
      const worker = new NotificationWorker(
        mockUseCase as unknown as SendTaskNotificationsUseCase,
        _1_MINUTE_MS,
        _12_HOURS
      );

      await worker.start();

      expect(mockUseCase.executeCalls[0]?.threshold).toEqual(_12_HOURS);

      worker.stop();
    });

    it('should stop executing when stopped', async () => {
      const worker = new NotificationWorker(
        mockUseCase as unknown as SendTaskNotificationsUseCase,
        _100_MS,
        _24_HOURS
      );

      await worker.start();

      const callsBeforeStop = mockUseCase.executeCalls.length;

      worker.stop();

      await new Promise((resolve) => setTimeout(resolve, _200_MS));

      const callsAfterStop = mockUseCase.executeCalls.length;

      expect(callsAfterStop).toEqual(callsBeforeStop);
    });
  });

  describe("::error handling", () => {
    it('should handle errors gracefully and continue', async () => {
      let callCount = 0;
      mockUseCase.setMockExecute(() => {
        callCount++;
        if (callCount === 1) {
          return Err('First call failed');
        }
        return Ok(undefined);
      });

      const worker = new NotificationWorker(
        mockUseCase as unknown as SendTaskNotificationsUseCase,
        _50_MS,
        _24_HOURS
      );

      await worker.start();

      await new Promise((resolve) => setTimeout(resolve, _120_MS));

      worker.stop();

      expect(callCount).toBeGreaterThan(1);
    });

    it('should log error when use case fails', async () => {
      const consoleErrorSpy = { calls: [] as any[] };
      const originalError = console.error;
      console.error = (...args: any[]) => {
        consoleErrorSpy.calls.push(args);
        originalError.apply(console, args);
      };

      mockUseCase.setMockExecute(() => Err('Use case failed'));

      const worker = new NotificationWorker(
        mockUseCase as unknown as SendTaskNotificationsUseCase,
        _1_MINUTE_MS,
        _24_HOURS
      );

      await worker.start();

      worker.stop();

      console.error = originalError;

      expect(consoleErrorSpy.calls.length).toBeGreaterThan(0);
      const allLogs = consoleErrorSpy.calls.map((call) => call.join(' ')).join('\n');
      expect(allLogs).toContain('Use case failed');
    });
  });

  describe("::interval execution", () => {
    it('should execute use case multiple times on interval', async () => {
      const worker = new NotificationWorker(
        mockUseCase as unknown as SendTaskNotificationsUseCase,
        _50_MS,
        _24_HOURS
      );

      await worker.start();

      await new Promise((resolve) => setTimeout(resolve, _120_MS));

      worker.stop();

      expect(mockUseCase.executeCalls.length).toBeGreaterThan(1);
    });
  });
});
