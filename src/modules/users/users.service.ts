import { Injectable } from '@nestjs/common';
import { Role } from 'src/decorators/roles/emuns/role.enum';
import { User } from './entity/user';

@Injectable()
export class UsersService {
	private readonly users: User[] = [
		{
			id: 1,
			username: 'admin',
			password: 'admin',
			roles: [Role.Admin],
		},
		{
			id: 2,
			username: 'user',
			password: 'user',
			roles: [Role.User],
		},
	];

	async findOne(username: string): Promise<User> {
		return this.users.find((user) => user.username === username);
	}
}
