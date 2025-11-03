import * as v from 'valibot';

export const CreateTaskSchema = v.object({
  title: v.pipe(
    v.string('Title must be a string'),
    v.trim(),
    v.minLength(1, 'Title cannot be empty'),
    v.maxLength(200, 'Title cannot exceed 200 characters')
  ),
  description: v.optional(
    v.pipe(
      v.string('Description must be a string'),
      v.trim(),
      v.maxLength(1000, 'Description cannot exceed 1000 characters')
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
      v.maxLength(200, 'Title cannot exceed 200 characters')
    )
  ),
  description: v.optional(
    v.pipe(
      v.string('Description must be a string'),
      v.trim(),
      v.maxLength(1000, 'Description cannot exceed 1000 characters')
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
    v.regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      'Invalid UUID v7 format'
    )
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
