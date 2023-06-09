import { InferModel, relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { users } from './users';
import { clients } from './clients';

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  done: boolean('done').notNull().default(false),

  userId: integer('user_id').references(() => users.id),
  clientId: integer('client_id').references(() => clients.id),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),

  client: one(clients, {
    fields: [tasks.clientId],
    references: [clients.id],
  }),
}));

export type TaskSchema = InferModel<typeof tasks>;
