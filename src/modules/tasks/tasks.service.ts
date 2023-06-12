import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/db/service/database.service';
import { tasks } from 'src/db/schema/tasks';
import { eq } from 'drizzle-orm';

@Injectable()
export class TasksService {
	constructor(private db: DatabaseService) { }

	async create(createTaskDto: CreateTaskDto) {
		const createdTask = await this.db.connection
			.insert(tasks)
			.values(createTaskDto)
			.returning();

		return createdTask[0];
	}

	async findAll() {
		return await this.db.connection.query.tasks.findMany({
			with: { client: true, user: { columns: { password: false } } },
		});
	}

	async findOne(id: number) {
		const foundTask = await this.db.connection.query.tasks.findFirst({
			where: eq(tasks.id, id),
			with: { client: true, user: { columns: { password: false } } },
		});

		return foundTask;
	}

	async update(id: number, updateTaskDto: UpdateTaskDto) {
		const updatedTask = await this.db.connection
			.update(tasks)
			.set(updateTaskDto)
			.where(eq(tasks.id, id))
			.returning();

		return updatedTask[0];
	}

	async remove(id: number) {
		const deletedTask = await this.db.connection
			.delete(tasks)
			.where(eq(tasks.id, id))
			.returning();

		return deletedTask[0];
	}
}
