import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
	constructor(private configService: ConfigService) { }

	connection: NodePgDatabase;

	onModuleInit() {
		const pool = new Pool({
			host: this.configService.get<string>('DB_HOST'),
			port: this.configService.get<number>('DB_CONTAINER_PORT'),
			user: this.configService.get<string>('DB_USER'),
			password: this.configService.get<string>('DB_PASSWORD'),
			database: this.configService.get<string>('DB_NAME'),
		});

		this.connection = drizzle(pool);
	}
}
