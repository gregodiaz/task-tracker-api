import { ClientSchema } from "src/db/schema/clients";
import { TaskEntity } from "src/modules/tasks/entities/task.entity";

export class ClientEntity {
  id: ClientSchema['id'];
  name: ClientSchema['name'];

	tasks: TaskEntity[];
}
