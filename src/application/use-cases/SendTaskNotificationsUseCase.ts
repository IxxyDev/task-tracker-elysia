import type { TaskRepository } from '@domain/repositories/TaskRepository';
import type { NotificationService } from '@application/ports/NotificationService';
import type { Result } from '@shared/Result';
import { Ok } from '@shared/Result';

export class SendTaskNotificationsUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly notificationService: NotificationService
  ) {}

  async execute(hoursThreshold?: number): Promise<Result<void>> {
    const tasksResult = await this.taskRepository.findDueSoon(hoursThreshold);

    if (!tasksResult.ok) {
      return tasksResult;
    }

    for (const task of tasksResult.value) {
      const notificationResult = await this.notificationService.sendTaskDueNotification(task);

      if (!notificationResult.ok) {
        return notificationResult;
      }
    }

    return Ok(undefined);
  }
}
