import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseService } from 'src/db/service/database.service';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/decorators/roles/emuns/role.enum';
import { UserEntity } from './entities/user.entity';
import { APP_PIPE } from '@nestjs/core';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  const expectedUser: UserEntity = {
    id: 2,
    username: 'Test',
    password: 'Test',
    roles: Role.User,
  };
  const expectedUser2: UserEntity = {
    id: 3,
    username: 'Test 2',
    password: 'Test 2',
    roles: Role.User,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        DatabaseService,
        ConfigService,
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('Unit tests', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'Test',
        password: 'Test',
      };

      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => expectedUser);

      expect(await controller.create(createUserDto)).toBe(expectedUser);
    });

    it('should throw a ConflictException when creating a user', async () => {
      const createUserDto = { username: 'Test', password: 'Test' };
      const expectedUsers = [expectedUser, expectedUser2];

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedUsers);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should return an array of users', async () => {
      const expectedUsers = [expectedUser, expectedUser2];

      jest
        .spyOn(service, 'findAll')
        .mockImplementation(async () => expectedUsers);

      expect(await controller.findAll()).toBe(expectedUsers);
    });

    it('should return an array of users with tasks', async () => {
      const task = {
        id: 1,
        description: 'Test',
        done: false,
        clientId: 1,
        userId: 1,
      };
      const expectedUsers = [
        { ...expectedUser, tasks: [] },
        { ...expectedUser2, tasks: [task] },
      ];

      jest
        .spyOn(service, 'findAllWithTasks')
        .mockImplementation(async () => expectedUsers);

      expect(await controller.findAllWithTasks()).toBe(expectedUsers);
    });

    it('should return a user by username', async () => {
      jest
        .spyOn(service, 'findOneByUsername')
        .mockImplementation(async () => expectedUser);

      expect(await controller.findOneByUsername('Test')).toBe(expectedUser);
    });

    it('should return a user', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => expectedUser);

      expect(await controller.findOne(2)).toBe(expectedUser);
    });

    it('should return a user with tasks', async () => {
      const task = {
        id: 1,
        description: 'Test',
        done: false,
        clientId: 1,
        userId: 1,
      };
      const expectedUserWithTasks = { ...expectedUser, tasks: [task, task] };

      jest
        .spyOn(service, 'findOneWithTasks')
        .mockImplementation(async () => expectedUserWithTasks);

      expect(await controller.findOneWithTasks(2)).toBe(expectedUserWithTasks);
    });

    it('should update a user', async () => {
      const username = 'Updated Test';
      const updatedUser = { ...expectedUser, username };

      jest.spyOn(service, 'update').mockImplementation(async () => updatedUser);

      expect(await controller.update(2, { username })).toBe(updatedUser);
    });

    it('should delete a user', async () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementation(async () => expectedUser);

      expect(await controller.remove(2)).toBe(expectedUser);
    });

    it('should not throw ConflictException if username is not taken', async () => {
      const username = 'AvailableUsername';
      const storedUsers = [
        { ...expectedUser, username: 'TakenUsername' },
        { ...expectedUser, username: 'AnotherUsername' },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(storedUsers);

      await expect(service.checkIfNameIsTaken(username)).resolves.not.toThrow(
        ConflictException,
      );
      await expect(
        service.checkIfNameIsTaken(username),
      ).resolves.toBeUndefined();
    });

    it('should throw ConflictException if username is taken', async () => {
      const username = 'TakenUsername';
      const storedUsers = [
        { ...expectedUser, username: 'TakenUsername' },
        { ...expectedUser, username: 'AnotherUsername' },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(storedUsers);

      await expect(service.checkIfNameIsTaken(username)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
