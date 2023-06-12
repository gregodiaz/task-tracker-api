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

	@Get('id/:id')
	findOneById(@Param('id') id: number) {
		return this.usersService.findOneById(+id);
	}

	@Get(':username')
	findOne(@Param('username') username: string) {
		return this.usersService.findOne(username);
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
