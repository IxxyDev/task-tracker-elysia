import { loadConfig } from '@shared/config';
import { db } from '@infrastructure/database/connection';
import { DrizzleTaskRepository } from '@infrastructure/database/DrizzleTaskRepository';
import { ConsoleNotificationService } from '@infrastructure/notification/ConsoleNotificationService';
import { SendTaskNotificationsUseCase } from '@application/use-cases/SendTaskNotificationsUseCase';
import { NotificationWorker } from '@infrastructure/worker/NotificationWorker';

const config = loadConfig();

const taskRepository = new DrizzleTaskRepository(db);
const notificationService = new ConsoleNotificationService();
const sendNotificationsUseCase = new SendTaskNotificationsUseCase(
  taskRepository,
  notificationService
);

const worker = new NotificationWorker(
  sendNotificationsUseCase,
  config.notificationCheckIntervalMs,
  config.notificationWindowHours
);

await worker.start();

const shutdown = () => {
  console.log('\n🛑 Shutting down notification worker...');
  worker.stop();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log('✅ Notification worker is running. Press Ctrl+C to stop.');
