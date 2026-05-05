import type { Task } from '@domain/entities/task.entity';

export class TaskResponseDTO {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  static fromDomain(task: Task): TaskResponseDTO {
    return {
      id: task.getId().toString(),
      title: task.getTitle().toString(),
      description: task.getDescription().toString(),
      dueDate: task.getDueDate().toDate().toISOString(),
      status: task.getStatus(),
      createdAt: task.getCreatedAt().toISOString(),
      updatedAt: task.getUpdatedAt().toISOString(),
    };
  }

  static fromDomainList(tasks: Task[]): TaskResponseDTO[] {
    return tasks.map((task) => TaskResponseDTO.fromDomain(task));
  }
}
