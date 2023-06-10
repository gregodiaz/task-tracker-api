import { InferModel } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { Role } from 'src/decorators/roles/emuns/role.enum';

export const users = pgTable('users', {
  id: serial('id'),
  username: text('username'),
  password: text('password'),
  roles: text('roles').$type<Role>(),
});

export type UserSchema = InferModel<typeof users>;
