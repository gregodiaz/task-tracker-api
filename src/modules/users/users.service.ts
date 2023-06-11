import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/db/service/database.service';
import { users } from 'src/db/schema/users';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.db.connection
      .insert(users)
      .values(createUserDto)
      .returning();
  }

  async findAll() {
    return await this.db.connection.select().from(users);
  }

  async findOne(username: string) {
    const result = await this.db.connection
      .select()
      .from(users)
      .where(eq(users.username, username));
    return result[0];
  }

  async findOneById(id: number) {
    const result = await this.db.connection
      .select()
      .from(users)
      .where(eq(users.id, id));
    return result[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.db.connection
      .update(users)
      .set(updateUserDto)
      .where(eq(users.id, id))
      .returning();
  }

  async remove(id: number) {
    return await this.db.connection
      .delete(users)
      .where(eq(users.id, id))
      .returning();
  }
}
