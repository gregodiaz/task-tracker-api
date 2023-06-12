import { ConflictException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { DatabaseService } from 'src/db/service/database.service';
import { clients } from 'src/db/schema/clients';
import { eq } from 'drizzle-orm';

@Injectable()
export class ClientsService {
	constructor(private db: DatabaseService) { }

	async create(createClientDto: CreateClientDto) {
		await this.checkIfNameIsTaken(createClientDto.name);

		const clientCreated = await this.db.connection
			.insert(clients)
			.values(createClientDto)
			.returning();

		return clientCreated[0];
	}

	async findAll() {
		return await this.db.connection.select().from(clients);
	}

	async findOne(id: number) {
		const clientFound = await this.db.connection
			.select()
			.from(clients)
			.where(eq(clients.id, id));

		return clientFound[0];
	}

	async update(id: number, updateClientDto: UpdateClientDto) {
		await this.checkIfNameIsTaken(updateClientDto.name);

		const clientUpdated = await this.db.connection
			.update(clients)
			.set(updateClientDto)
			.where(eq(clients.id, id))
			.returning();

		return clientUpdated[0];
	}

	async remove(id: number) {
		const clientDeleted = await this.db.connection
			.delete(clients)
			.where(eq(clients.id, id))
			.returning();

		return clientDeleted[0];
	}

	async checkIfNameIsTaken(name: string) {
		const storedClients = await this.findAll();
		const isTaken = storedClients.some((client) => client.name === name);
		if (isTaken) {
			throw new ConflictException('Clientname is already taken');
		}
	}
}
