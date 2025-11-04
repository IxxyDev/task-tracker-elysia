import * as v from 'valibot';
import { Title } from '@domain/valueObjects/title.valueObject';
import { Description } from '@domain/valueObjects/description.valueObject';
import { TaskId } from '@domain/valueObjects/taskId.valueObject';

export const CreateTaskSchema = v.object({
  title: v.pipe(
    v.string('Title must be a string'),
    v.trim(),
    v.minLength(1, 'Title cannot be empty'),
    v.maxLength(Title.MAX_LENGTH, `Title cannot exceed ${Title.MAX_LENGTH} characters`)
  ),
  description: v.optional(
    v.pipe(
      v.string('Description must be a string'),
      v.trim(),
      v.maxLength(Description.MAX_LENGTH, `Description cannot exceed ${Description.MAX_LENGTH} characters`)
    )
  ),
  dueDate: v.pipe(
    v.string('Due date must be a string'),
    v.isoTimestamp('Due date must be valid ISO timestamp')
  ),
});

export const UpdateTaskSchema = v.object({
  title: v.optional(
    v.pipe(
      v.string('Title must be a string'),
      v.trim(),
      v.minLength(1, 'Title cannot be empty'),
      v.maxLength(Title.MAX_LENGTH, `Title cannot exceed ${Title.MAX_LENGTH} characters`)
    )
  ),
  description: v.optional(
    v.pipe(
      v.string('Description must be a string'),
      v.trim(),
      v.maxLength(Description.MAX_LENGTH, `Description cannot exceed ${Description.MAX_LENGTH} characters`)
    )
  ),
  dueDate: v.optional(
    v.pipe(
      v.string('Due date must be a string'),
      v.isoTimestamp('Due date must be valid ISO timestamp')
    )
  ),
});

export const ChangeStatusSchema = v.object({
  action: v.picklist(['start', 'complete', 'cancel'], 'Action must be start, complete, or cancel'),
});

export const TaskIdParamSchema = v.object({
  id: v.pipe(
    v.string('Task ID must be a string'),
    v.regex(TaskId.UUID_V7_REGEX, 'Invalid UUID v7 format')
  ),
});

export const ListTasksQuerySchema = v.object({
  status: v.optional(v.picklist(['pending', 'in_progress', 'completed', 'cancelled'])),
  dueSoon: v.optional(v.pipe(v.string(), v.transform((val) => val === 'true'))),
  hoursThreshold: v.optional(v.pipe(v.string(), v.transform(Number))),
});

export type CreateTaskInput = v.InferOutput<typeof CreateTaskSchema>;
export type UpdateTaskInput = v.InferOutput<typeof UpdateTaskSchema>;
export type ChangeStatusInput = v.InferOutput<typeof ChangeStatusSchema>;
export type TaskIdParam = v.InferOutput<typeof TaskIdParamSchema>;
export type ListTasksQuery = v.InferOutput<typeof ListTasksQuerySchema>;
