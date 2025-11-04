import type { Task } from '@domain/entities/task.entity';
import type { Result } from '@shared/result.types';

export interface NotificationService {
  sendTaskDueNotification(task: Task): Promise<Result<void>>;
}
