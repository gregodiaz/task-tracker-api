import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './emuns/role.enum';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from 'src/modules/users/users.service';
import { SKIP_AUTH_KEY } from '../skip-auth/skip-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canSkipAuth = this.reflector.getAllAndOverride<boolean>(
      SKIP_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (canSkipAuth) return true;

    let requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    try {
      const { user } = context.switchToHttp().getRequest();
      const userFound = await this.userService.findOneByUsername(user?.username);

      const isAdmin = userFound?.roles?.includes(Role.Admin);
      if (isAdmin) return true;

      return requiredRoles.some((role) => userFound?.roles?.includes(role));
    } catch {
      return false;
    }
  }
}
