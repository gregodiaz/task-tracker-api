import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { DatabaseService } from 'src/db/service/database.service';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let db: DatabaseService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TasksService, DatabaseService, ConfigService],
    }).compile();

    service = moduleRef.get<TasksService>(TasksService);
    db = moduleRef.get<DatabaseService>(DatabaseService);
  });

  describe('Unit tests', () => {
    it('should create a task', async () => {
      const createTaskDto = { description: 'Test', userId: 1, clientId: 1 };
      const expectedResult = { id: 1, ...createTaskDto, done: false };
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => expectedResult);

      expect(await service.create(createTaskDto)).toBe(expectedResult);
    });

    it('should return an array of tasks', async () => {
      const expectedResult = [
        { id: 1, description: 'Task 1', done: false, userId: 1, clientId: 1 },
        { id: 2, description: 'Task 2', done: false, userId: 2, clientId: 1 },
      ];

      jest
        .spyOn(service, 'findAll')
        .mockImplementation(async () => expectedResult);

      expect(await service.findAll()).toBe(expectedResult);
    });

    it('should return a task', async () => {
      const expectedResult = {
        id: 1,
        description: 'Test',
        done: false,
        userId: 1,
        clientId: 1,
      };

      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => expectedResult);

      expect(await service.findOne(1)).toBe(expectedResult);
    });

    it('should update a task', async () => {
      const description = 'Updated Test';
      const expectedResult = {
        id: 1,
        description,
        done: false,
        userId: 1,
        clientId: 1,
      };

      jest
        .spyOn(service, 'update')
        .mockImplementation(async () => expectedResult);

      expect(await service.update(1, { description })).toBe(expectedResult);
    });

    it('should delete a task', async () => {
      const expectedResult = {
        id: 1,
        description: 'Test',
        done: false,
        userId: 1,
        clientId: 1,
      };

      jest
        .spyOn(service, 'remove')
        .mockImplementation(async () => expectedResult);

      expect(await service.remove(1)).toBe(expectedResult);
    });
  });
});
