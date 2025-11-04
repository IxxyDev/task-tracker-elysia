import { db } from '@infrastructure/database/db.connection';
import { DrizzleTaskRepository } from '@infrastructure/database/task.db.repository';
import { ConsoleNotificationService } from '@infrastructure/notification/console.notification.service';
import { CreateTaskUseCase } from '@application/useCases/createTask.useCase';
import { GetTaskUseCase } from '@application/useCases/getTask.useCase';
import { UpdateTaskUseCase } from '@application/useCases/updateTask.useCase';
import { ChangeTaskStatusUseCase } from '@application/useCases/changeTaskStatus.useCase';
import { ListTasksUseCase } from '@application/useCases/listTasks.useCase';
import { DeleteTaskUseCase } from '@application/useCases/deleteTask.useCase';
import { SendTaskNotificationsUseCase } from '@application/useCases/sendTaskNotifications.useCase';

export function createTaskRepository() {
  return new DrizzleTaskRepository(db);
}

export function createNotificationService() {
  return new ConsoleNotificationService();
}

export function createUseCases() {
  const taskRepository = createTaskRepository();
  const notificationService = createNotificationService();

  return {
    createTask: new CreateTaskUseCase(taskRepository),
    getTask: new GetTaskUseCase(taskRepository),
    updateTask: new UpdateTaskUseCase(taskRepository),
    changeTaskStatus: new ChangeTaskStatusUseCase(taskRepository),
    listTasks: new ListTasksUseCase(taskRepository),
    deleteTask: new DeleteTaskUseCase(taskRepository),
    sendNotifications: new SendTaskNotificationsUseCase(
      taskRepository,
      notificationService
    ),
  };
}
