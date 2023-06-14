import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from 'src/db/service/database.service';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import { Role } from 'src/decorators/roles/emuns/role.enum';
import { UserEntity } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let db: DatabaseService;
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
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService, DatabaseService, ConfigService],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
    db = moduleRef.get<DatabaseService>(DatabaseService);
  });

  describe('Unit tests', () => {
    it('should create a user', async () => {
      const createUserDto = { username: 'Test', password: 'password' };

      jest
        .spyOn(service, 'checkIfNameIsTaken')
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => expectedUser);

      expect(await service.create(createUserDto)).toBe(expectedUser);
    });

    it('should throw a ConflictException when creating a user', async () => {
      const createUserDto = { username: 'TakenName', password: 'password' };
      const expectedUsers = [
        { ...expectedUser, username: 'TakenName' },
        { ...expectedUser2, username: 'AnotherName' },
      ];

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

      expect(await service.findAll()).toBe(expectedUsers);
    });

    it('should return an array of users with tasks', async () => {
      const task = {
        id: 1,
        description: 'Test',
        done: false,
        clientId: 1,
        userId: 1,
      };
      const expectedUsersWithTasks = [
        { ...expectedUser, tasks: [task] },
        { ...expectedUser2, tasks: [task, task] },
      ];

      jest
        .spyOn(service, 'findAllWithTasks')
        .mockImplementation(async () => expectedUsersWithTasks);

      expect(await service.findAllWithTasks()).toBe(expectedUsersWithTasks);
    });

    it('should return a user', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => expectedUser);

      expect(await service.findOne(2)).toBe(expectedUser);
    });

    it('should return a user with tasks', async () => {
      const task = {
        id: 1,
        description: 'Test',
        done: false,
        clientId: 1,
        userId: 1,
      };
      const expectedUserWithTasks = { ...expectedUser, tasks: [task] };

      jest
        .spyOn(service, 'findOneWithTasks')
        .mockImplementation(async () => expectedUserWithTasks);

      expect(await service.findOneWithTasks(2)).toBe(expectedUserWithTasks);
    });

    it('should update a user', async () => {
      const username = 'Test 2';
      const updatedUser = { ...expectedUser, username };

      jest.spyOn(service, 'update').mockImplementation(async () => updatedUser);

      expect(await service.update(2, { username })).toBe(updatedUser);
    });

    it('should delete a user', async () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementation(async () => expectedUser);

      expect(await service.remove(2)).toBe(expectedUser);
    });

    it('should not throw ConflictException if username is not taken', async () => {
      const username = 'AvailableName';
      const expectedUsers = [
        { ...expectedUser, username: 'TakenName' },
        { ...expectedUser2, username: 'AnotherName' },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedUsers);

      await expect(service.checkIfNameIsTaken(username)).resolves.not.toThrow(
        ConflictException,
      );
      await expect(
        service.checkIfNameIsTaken(username),
      ).resolves.toBeUndefined();
    });

    it('should throw ConflictException if username is taken', async () => {
      const username = 'TakenName';
      const expectedUsers = [
        { ...expectedUser, username: 'TakenName' },
        { ...expectedUser2, username: 'AnotherName' },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedUsers);

      await expect(service.checkIfNameIsTaken(username)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
