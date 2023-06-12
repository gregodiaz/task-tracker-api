import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from 'src/decorators/roles/emuns/role.enum';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Roles(Role.Admin)
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get('tasks')
	findAllWithTasks() {
		return this.usersService.findAllWithTasks();
	}

	@Get('username/:username')
	findOneByUsername(@Param('username') username: string) {
		return this.usersService.findOneByUsername(username);
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.usersService.findOne(+id);
	}

	@Get(':id/tasks')
	findOneWithTasks(@Param('id') id: number) {
		return this.usersService.findOneWithTasks(+id);
	}

	@Roles(Role.Admin)
	@Patch(':id')
	update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(+id, updateUserDto);
	}

	@Roles(Role.Admin)
	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.usersService.remove(+id);
	}
}
