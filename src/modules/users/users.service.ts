import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/db/service/database.service';
import { users } from 'src/db/schema/users';
import { eq } from 'drizzle-orm';
import { Role } from 'src/decorators/roles/emuns/role.enum';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}
  public saltOrRounds = 10;

  async create(createUserDto: CreateUserDto) {
    const { username, password, roles = Role.User } = createUserDto;

    // Check if username is taken
    const storedUsers = await this.findAll();
    const isTaken = storedUsers.some((user) => user.username === username);
    if (isTaken) {
      throw new ConflictException('Username is already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);

    const newUser = { username, password: hashedPassword, roles };

    // Create user
    return await this.db.connection.insert(users).values(newUser).returning();
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
    const { password } = updateUserDto;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
      updateUserDto.password = hashedPassword;
    }

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
