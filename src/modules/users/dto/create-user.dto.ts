import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Role } from 'src/decorators/roles/emuns/role.enum';
import { UserSchema } from 'src/db/schema/users';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: UserSchema['username'];

  @IsNotEmpty()
  @IsString()
  password: UserSchema['password'];

  @IsOptional()
  @IsEnum(Role)
  roles?: UserSchema['roles'];
}
