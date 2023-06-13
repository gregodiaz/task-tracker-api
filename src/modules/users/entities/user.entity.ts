import { Exclude } from 'class-transformer';
import { Role } from 'src/decorators/roles/emuns/role.enum';
import { TaskEntity } from 'src/modules/tasks/entities/task.entity';

export class UserEntity {
  id: number;
  username: string;
  roles: Role;

  @Exclude()
  password: string;

	tasks?: TaskEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
