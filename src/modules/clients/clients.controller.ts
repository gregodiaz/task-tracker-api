import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from 'src/decorators/roles/emuns/role.enum';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get('tasks')
  findAllWithTasks() {
    return this.clientsService.findAllWithTasks();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.clientsService.findOne(+id);
  }

  @Get(':id/tasks')
  findOneWithTasks(@Param('id') id: number) {
    return this.clientsService.findOneWithTasks(+id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.clientsService.remove(+id);
  }
}
