import { ConflictException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { DatabaseService } from 'src/db/service/database.service';
import { ClientSchema, clients } from 'src/db/schema/clients';
import { eq } from 'drizzle-orm';
import { ClientEntity } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(private db: DatabaseService) {}

  async create(createClientDto: CreateClientDto) {
    await this.checkIfNameIsTaken(createClientDto.name);

    const createdClient: ClientSchema[] = await this.db.connection
      .insert(clients)
      .values(createClientDto)
      .returning();
    const newClient: Omit<ClientEntity, 'tasks'> = createdClient[0];

    return newClient;
  }

  async findAll() {
    const storedClients: Omit<ClientEntity, 'tasks'>[] =
      await this.db.connection.select().from(clients);

    return storedClients;
  }

  async findAllWithTasks() {
    const storedClients: ClientEntity[] =
      await this.db.connection.query.clients.findMany({
        with: { tasks: true },
      });

    return storedClients;
  }

  async findOne(id: number) {
    const foundClient: Omit<ClientEntity, 'tasks'>[] = await this.db.connection
      .select()
      .from(clients)
      .where(eq(clients.id, id));

    return foundClient[0];
  }

  async findOneWithTasks(id: number) {
    const storedClient: ClientEntity =
      await this.db.connection.query.clients.findFirst({
        where: eq(clients.id, id),
        with: { tasks: true },
      });

    return storedClient;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    await this.checkIfNameIsTaken(updateClientDto.name);

    const updatedClient: Omit<ClientEntity, 'tasks'>[] =
      await this.db.connection
        .update(clients)
        .set(updateClientDto)
        .where(eq(clients.id, id))
        .returning();

    return updatedClient[0];
  }

  async remove(id: number) {
    const deletedClient: Omit<ClientEntity, 'tasks'>[] =
      await this.db.connection
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
