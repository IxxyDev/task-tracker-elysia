import type { SendTaskNotificationsUseCase } from '@application/useCases/sendTaskNotifications.useCase';

export class NotificationWorker {
  private intervalId: Timer | null = null;

  constructor(
    private readonly sendNotificationsUseCase: SendTaskNotificationsUseCase,
    private readonly checkIntervalMs: number,
    private readonly notificationWindowHours: number
  ) {}

  async start(): Promise<void> {
    console.log(`🔔 Starting notification worker (checking every ${this.checkIntervalMs}ms)`);

    await this.executeCheck();

    this.intervalId = setInterval(async () => {
      await this.executeCheck();
    }, this.checkIntervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🔕 Notification worker stopped');
    }
  }

  private async executeCheck(): Promise<void> {
    try {
      const result = await this.sendNotificationsUseCase.execute(this.notificationWindowHours);

      if (!result.ok) {
        console.error(`❌ Error sending notifications: ${result.error}`);
      }
    } catch (error) {
      console.error(`❌ Unexpected error in notification worker: ${error}`);
    }
  }
}
