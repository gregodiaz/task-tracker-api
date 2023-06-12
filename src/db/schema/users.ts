import { InferModel, relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { Role } from 'src/decorators/roles/emuns/role.enum';
import { tasks } from './tasks';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	username: text('username').notNull(),
	password: text('password').notNull(),
	roles: text('roles').$type<Role>().default(Role.User),
});

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

export type UserSchema = InferModel<typeof users>;
