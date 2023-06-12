import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { DatabaseService } from 'src/db/service/database.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, DatabaseService],
})
export class ClientsModule {}
