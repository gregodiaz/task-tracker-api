import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/decorators/roles/emuns/role.enum';
import { UserSchema } from 'src/db/schema/users';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: UserSchema['username'];

  @IsNotEmpty()
  @IsString()
  password: UserSchema['password'];

  @IsEnum(Role)
  roles: UserSchema['roles'];
}
