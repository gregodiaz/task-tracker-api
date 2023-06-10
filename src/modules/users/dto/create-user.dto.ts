import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/decorators/roles/emuns/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEnum(Role)
  roles: Role[] = [Role.User];
}
