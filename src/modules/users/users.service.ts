import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/db/service/database.service';
import { users } from 'src/db/schema/users';
import { eq } from 'drizzle-orm';
import { Role } from 'src/decorators/roles/emuns/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}
  public saltOrRounds = 10;

  async create(createUserDto: CreateUserDto) {
    const { username, password, roles = Role.User } = createUserDto;

    await this.checkIfNameIsTaken(username);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
    const userCreated = await this.db.connection
      .insert(users)
      .values({ username, password: hashedPassword, roles })
      .returning();

    return userCreated[0];
  }

  async findAll() {
    return await this.db.connection.select().from(users);
  }

  async findOne(username: string) {
    const userFound = await this.db.connection
      .select()
      .from(users)
      .where(eq(users.username, username));

    return userFound[0];
  }

  async findOneById(id: number) {
    const result = await this.db.connection
      .select()
      .from(users)
      .where(eq(users.id, id));

    return result[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.checkIfNameIsTaken(updateUserDto.username);

    const { password } = updateUserDto;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
      updateUserDto.password = hashedPassword;
    }

    const userUpdated = await this.db.connection
      .update(users)
      .set(updateUserDto)
      .where(eq(users.id, id))
      .returning();

    return userUpdated[0];
  }

  async remove(id: number) {
    const userDeleted = await this.db.connection
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return userDeleted[0];
  }

  async checkIfNameIsTaken(name: string) {
    const storedUsers = await this.findAll();
    const isTaken = storedUsers.some((user) => user.username === name);
    if (isTaken) {
      throw new ConflictException('Username is already taken');
    }
  }
}
