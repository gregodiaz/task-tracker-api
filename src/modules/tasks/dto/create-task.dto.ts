import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
	@IsNotEmpty()
	@IsString()
	description: string;

	@IsBoolean()
	done: boolean;

	@IsNotEmpty()
	@IsInt()
	userId: number;

	@IsNotEmpty()
	@IsInt()
	clientId: number;
}
