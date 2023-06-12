import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as users from '../schema/users';
import * as clients from '../schema/clients';
import * as tasks from '../schema/tasks';

const schema = { ...users, ...clients, ...tasks };

@Injectable()
export class DatabaseService implements OnModuleInit {
	constructor(private configService: ConfigService) { }

	connection: NodePgDatabase<typeof schema>;

	onModuleInit() {
		const pool = new Pool({
			host: this.configService.get<string>('DB_HOST'),
			port: this.configService.get<number>('DB_CONTAINER_PORT'),
			user: this.configService.get<string>('DB_USER'),
			password: this.configService.get<string>('DB_PASSWORD'),
			database: this.configService.get<string>('DB_NAME'),
		});

		this.connection = drizzle(pool, { schema });
	}
}
