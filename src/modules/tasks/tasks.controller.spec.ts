import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { DatabaseService } from 'src/db/service/database.service';
import { ConfigService } from '@nestjs/config';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService, DatabaseService, ConfigService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  describe('Unit tests', () => {
    it('should create a task', async () => {
      const createTaskDto = { description: 'Test', userId: 1, clientId: 1 };
      const expectedResult = { id: 1, ...createTaskDto, done: false };
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => expectedResult);

      expect(await controller.create(createTaskDto)).toBe(expectedResult);
    });

    it('should return an array of tasks', async () => {
      const expectedResult = [
        { id: 1, description: 'Task 1', done: false, userId: 1, clientId: 1 },
        { id: 2, description: 'Task 2', done: false, userId: 2, clientId: 1 },
      ];

      jest
        .spyOn(service, 'findAll')
        .mockImplementation(async () => expectedResult);

      expect(await controller.findAll()).toBe(expectedResult);
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

      expect(await controller.findOne(1)).toBe(expectedResult);
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

      expect(await controller.update(1, { description })).toBe(expectedResult);
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

      expect(await controller.remove(1)).toBe(expectedResult);
    });
  });
});
