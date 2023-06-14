import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
	@IsNotEmpty()
	@IsString()
	description: string;

	@IsOptional()
	@IsBoolean()
	done?: boolean;

	@IsNotEmpty()
	@IsInt()
	userId: number;

	@IsNotEmpty()
	@IsInt()
	clientId: number;
}
