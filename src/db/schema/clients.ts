import { InferModel } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export type ClientSchema = InferModel<typeof clients>;
