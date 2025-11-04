import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull().default(""),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export type TaskRow = typeof tasks.$inferSelect;
export type TaskInsert = typeof tasks.$inferInsert;