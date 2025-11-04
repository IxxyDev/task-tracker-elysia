import type { Task } from '@domain/entities/Task';
import type { Result } from '@shared/Result';

export interface NotificationService {
  sendTaskDueNotification(task: Task): Promise<Result<void>>;
}
