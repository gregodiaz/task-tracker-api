import { TaskSchema } from "src/db/schema/tasks";

export class TaskEntity {
	id: TaskSchema['id'];
	description: TaskSchema['description'];
	done: TaskSchema['done'];

	userId: TaskSchema['userId'];
	clientId: TaskSchema['clientId'];
}
