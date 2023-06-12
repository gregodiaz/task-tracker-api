import { InferModel, relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tasks } from './tasks';

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const clientsRelations = relations(clients, ({ many }) => ({
  tasks: many(tasks),
}));

export type ClientSchema = InferModel<typeof clients>;
