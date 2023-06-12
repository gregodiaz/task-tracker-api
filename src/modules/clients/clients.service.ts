import { ConflictException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { DatabaseService } from 'src/db/service/database.service';
import { clients } from 'src/db/schema/clients';
import { eq } from 'drizzle-orm';

@Injectable()
export class ClientsService {
  constructor(private db: DatabaseService) {}

  async create(createClientDto: CreateClientDto) {
    await this.checkIfNameIsTaken(createClientDto.name);

    const createdClient = await this.db.connection
      .insert(clients)
      .values(createClientDto)
      .returning();

    return createdClient[0];
  }

  async findAll() {
    return await this.db.connection.select().from(clients);
  }

  async findAllWithTasks() {
    const storedClients = await this.db.connection.query.users.findMany({
      with: { tasks: true },
    });

    return storedClients;
  }

  async findOne(id: number) {
    const foundClient = await this.db.connection
      .select()
      .from(clients)
      .where(eq(clients.id, id));

    return foundClient[0];
  }

  async findOneWithTasks(id: number) {
    const storedClient = await this.db.connection.query.clients.findFirst({
      where: eq(clients.id, id),
      with: { tasks: true },
    });

    return storedClient;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    await this.checkIfNameIsTaken(updateClientDto.name);

    const updatedClient = await this.db.connection
      .update(clients)
      .set(updateClientDto)
      .where(eq(clients.id, id))
      .returning();

    return updatedClient[0];
  }

  async remove(id: number) {
    const deletedClient = await this.db.connection
      .delete(clients)
      .where(eq(clients.id, id))
      .returning();

    return deletedClient[0];
  }

  async checkIfNameIsTaken(name: string) {
    const storedClients = await this.findAll();
    const isTaken = storedClients.some((client) => client.name === name);
    if (isTaken) {
      throw new ConflictException('Clientname is already taken');
    }
  }
}
