import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from 'src/decorators/roles/roles.guard';

describe('AuthController', () => {
	let controller: AuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				UsersModule,
				JwtModule.register({
					global: true,
					secret: jwtConstants.secret,
					signOptions: { expiresIn: '1d' },
				}),
			],
			controllers: [AuthController],
			providers: [
				AuthService,
				{
					provide: APP_GUARD,
					useExisting: AuthGuard,
				},
				AuthGuard,
				{
					provide: APP_GUARD,
					useExisting: RolesGuard,
				},
				RolesGuard,
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
