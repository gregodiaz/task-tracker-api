import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from 'src/decorators/roles/roles.guard';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

describe('AuthService', () => {
	let service: AuthService;

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

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
