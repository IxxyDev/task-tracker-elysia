import { loadConfig } from '@shared/app.config';
import { db } from '@infrastructure/database/db.connection';
import { DrizzleTaskRepository } from '@infrastructure/database/task.db.repository';
import { ConsoleNotificationService } from '@infrastructure/notification/console.notification.service';
import { SendTaskNotificationsUseCase } from '@application/useCases/sendTaskNotifications.useCase';
import { NotificationWorker } from '@infrastructure/worker/notification.worker.service';

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
