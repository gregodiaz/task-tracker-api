import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { DatabaseService } from 'src/db/service/database.service';
import { ConfigService } from '@nestjs/config';
import { ConflictException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('ClientsController', () => {
	let controller: ClientsController;
	let service: ClientsService;
	let app: INestApplication;
	let authToken: string;
	let url: string;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ClientsController],
			providers: [ClientsService, DatabaseService, ConfigService],
		}).compile();

		controller = module.get<ClientsController>(ClientsController);
		service = module.get<ClientsService>(ClientsService);

		app = module.createNestApplication();
		await app.init();

		url = 'http://localhost:3000';
		const response = await request(url)
			.post('/auth/login')
			.set('Content-Type', 'application/json')
			.send({ username: 'admin', password: 'admin' });

		authToken = response.body.access_token;
	});

	afterEach(async () => {
		await app.close();
	});

	describe('Unit tests', () => {
		it('should create a client', async () => {
			const result = { id: 1, name: 'Test' };
			jest.spyOn(service, 'create').mockImplementation(async () => result);

			expect(await controller.create(result)).toBe(result);
		});

		it('should throw a ConflictException when creating a client', async () => {
			const createClientDto = { name: 'TakenName' };
			const storedClients = [
				{ id: 1, name: 'TakenName' },
				{ id: 2, name: 'AnotherName' },
			];

			jest.spyOn(service, 'findAll').mockResolvedValue(storedClients);

			await expect(service.create(createClientDto)).rejects.toThrow(
				ConflictException,
			);
		});

		it('should return an array of clients', async () => {
			const result = [
				{ id: 1, name: 'Test' },
				{ id: 2, name: 'Test 2' },
			];

			jest.spyOn(service, 'findAll').mockImplementation(async () => result);

			expect(await controller.findAll()).toBe(result);
		});

		it('should return an array of clients with tasks', async () => {
			const task = {
				id: 1,
				description: 'Test',
				done: false,
				clientId: 1,
				userId: 1,
			};
			const result = [
				{ id: 1, name: 'Test', tasks: [] },
				{ id: 2, name: 'Test 2', tasks: [task] },
			];

			jest
				.spyOn(service, 'findAllWithTasks')
				.mockImplementation(async () => result);

			expect(await controller.findAllWithTasks()).toBe(result);
		});

		it('should return a client', async () => {
			const result = { id: 1, name: 'Test' };

			jest.spyOn(service, 'findOne').mockImplementation(async () => result);

			expect(await controller.findOne(1)).toBe(result);
		});

		it('should return a client with tasks', async () => {
			const task = {
				id: 1,
				description: 'Test',
				done: false,
				clientId: 1,
				userId: 1,
			};
			const result = { id: 1, name: 'Test', tasks: [task, task] };

			jest
				.spyOn(service, 'findOneWithTasks')
				.mockImplementation(async () => result);

			expect(await controller.findOneWithTasks(1)).toBe(result);
		});

		it('should update a client', async () => {
			const name = 'Test 2';
			const result = { id: 1, name };

			jest.spyOn(service, 'update').mockImplementation(async () => result);

			expect(await controller.update(1, { name })).toBe(result);
		});

		it('should delete a client', async () => {
			const result = { id: 1, name: 'Test' };

			jest.spyOn(service, 'remove').mockImplementation(async () => result);

			expect(await controller.remove(1)).toBe(result);
		});

		it('should not throw ConflictException if name is not taken', async () => {
			const name = 'AvailableName';
			const storedClients = [
				{ id: 1, name: 'TakenName' },
				{ id: 2, name: 'AnotherName' },
			];

			jest.spyOn(service, 'findAll').mockResolvedValue(storedClients);

			await expect(service.checkIfNameIsTaken(name)).resolves.not.toThrow(
				ConflictException,
			);
			await expect(service.checkIfNameIsTaken(name)).resolves.toBeUndefined();
		});

		it('should throw ConflictException if name is taken', async () => {
			const name = 'TakenName';
			const storedClients = [
				{ id: 1, name: 'TakenName' },
				{ id: 2, name: 'AnotherName' },
			];

			jest.spyOn(service, 'findAll').mockResolvedValue(storedClients);

			await expect(service.checkIfNameIsTaken(name)).rejects.toThrow(
				ConflictException,
			);
		});
	});

	describe('HTTP requests', () => {
		it('should create a client (HTTP)', async () => {
			const client = { id: 1, name: 'Test' };

			return request(url)
				.post('/clients')
				.send(client)
				.set('Authorization', `Bearer ${authToken}`)
				.expect(201)
				.expect(client);
		});

		it('should return an array of clients (HTTP)', async () => {
			return request(url)
				.get('/clients')
				.set('Authorization', `Bearer ${authToken}`)
				.expect(200)
				.expect((response) => {
					expect(response.body).toBeInstanceOf(Array);
				});
		});

		it('should return a client (HTTP)', async () => {
			const clientId = 1;

			return request(url)
				.get(`/clients/${clientId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.expect(200)
				.expect((response) => {
					expect(response.body).toHaveProperty('id', clientId);
				});
		});

		it('should update a client (HTTP)', async () => {
			const id = 1;
			const name = 'Updated Test';
			const updatedClient = { id, name };

			return request(url)
				.patch(`/clients/${id}`)
				.send({ name })
				.set('Authorization', `Bearer ${authToken}`)
				.expect(200)
				.expect(updatedClient);
		});

		it('should delete a client (HTTP)', async () => {
			const clientId = 1;

			return request(url)
				.delete(`/clients/${clientId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.expect(200)
				.expect((response) => {
					expect(response.body).toHaveProperty('id', clientId);
				});
		});
	});
});
