import { loadConfig } from '@shared/app.config';
import { createUseCases } from '@infrastructure/composition/dependencies';
import { NotificationWorker } from '@infrastructure/worker/notification.worker.service';

const config = loadConfig();

const useCases = createUseCases();

const worker = new NotificationWorker(
  useCases.sendNotifications,
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
