import { InferModel } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { Role } from 'src/decorators/roles/emuns/role.enum';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	username: text('username').notNull(),
	password: text('password').notNull(),
	roles: text('roles').$type<Role>().default(Role.User),
});

export type UserSchema = InferModel<typeof users>;
