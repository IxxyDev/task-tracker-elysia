import type { NotificationService } from '@application/ports/NotificationService';
import type { Task } from '@domain/entities/Task';
import type { Result } from '@shared/Result';
import { Ok } from '@shared/Result';

export class ConsoleNotificationService implements NotificationService {
  async sendTaskDueNotification(task: Task): Promise<Result<void>> {
    console.log('\n⚠️  Task Due Soon!');
    console.log(`ID: ${task.getId().toString()}`);
    console.log(`Title: "${task.getTitle().toString()}"`);
    console.log(`Description: "${task.getDescription().toString()}"`);
    console.log(`Due: ${task.getDueDate().toDate().toISOString()}`);
    console.log(`Status: ${task.getStatus()}`);
    console.log('');

    return Ok(undefined);
  }
}
