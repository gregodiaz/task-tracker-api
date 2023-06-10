import { Role } from 'src/decorators/roles/emuns/role.enum';

export class User {
  id: number;
  username: string;
  password: string;
  roles: Role[];
}
