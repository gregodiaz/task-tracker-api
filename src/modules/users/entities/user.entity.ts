import { Exclude } from 'class-transformer';
import { Role } from 'src/decorators/roles/emuns/role.enum';

export class UserEntity {
  id: number;
  username: string;
  roles: Role;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
