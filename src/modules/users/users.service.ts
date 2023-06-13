import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/db/service/database.service';
import { UserSchema, users } from 'src/db/schema/users';
import { eq } from 'drizzle-orm';
import { Role } from 'src/decorators/roles/emuns/role.enum';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}
  public saltOrRounds = 10;

  async create(createUserDto: CreateUserDto) {
    const { username, password, roles = Role.User } = createUserDto;

    await this.checkIfNameIsTaken(username);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
    const createdUser: UserSchema[] = await this.db.connection
      .insert(users)
      .values({ username, password: hashedPassword, roles })
      .returning();
    const newUser: UserEntity = new UserEntity(createdUser[0]);

    return newUser;
  }

  async findAll() {
    const storedUsers: UserSchema[] = await this.db.connection
      .select()
      .from(users);
    const allUsers: Omit<UserEntity, 'tasks'>[] = storedUsers.map(
      (user) => new UserEntity(user),
    );

    return allUsers;
  }

  async findAllWithTasks() {
    const storedUsers: Omit<UserSchema, 'password'>[] =
      await this.db.connection.query.users.findMany({
        columns: { password: false },
        with: { tasks: true },
      });
    const allUsers = storedUsers.map((user) => new UserEntity(user));

    return allUsers;
  }

  async findOneByUsername(username: string) {
    const storedUser: UserSchema[] = await this.db.connection
      .select()
      .from(users)
      .where(eq(users.username, username));
    const foundUser = new UserEntity(storedUser[0]);

    return foundUser;
  }

  async findOne(id: number) {
    const storedUser: UserSchema[] = await this.db.connection
      .select()
      .from(users)
      .where(eq(users.id, id));
    const foundUser: Omit<UserEntity, 'tasks'> = new UserEntity(storedUser[0]);

    return foundUser;
  }

  async findOneWithTasks(id: number) {
    const storedUser: Omit<UserSchema, 'password'> =
      await this.db.connection.query.users.findFirst({
        where: eq(users.id, id),
        columns: { password: false },
        with: { tasks: true },
      });
    const foundUser = new UserEntity(storedUser);

    return foundUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.checkIfNameIsTaken(updateUserDto.username);

    const { password } = updateUserDto;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
      updateUserDto.password = hashedPassword;
    }

    const storedUser: UserSchema[] = await this.db.connection
      .update(users)
      .set(updateUserDto)
      .where(eq(users.id, id))
      .returning();
    const updatedUser = new UserEntity(storedUser[0]);

    return updatedUser;
  }

  async remove(id: number) {
    const storedUser: UserSchema[] = await this.db.connection
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    const deletedUser = new UserEntity(storedUser[0]);

    return deletedUser;
  }

  async checkIfNameIsTaken(name: string) {
    const storedUsers = await this.findAll();
    const isTaken = storedUsers.some((user) => user.username === name);
    if (isTaken) {
      throw new ConflictException('Username is already taken');
    }
  }
}
