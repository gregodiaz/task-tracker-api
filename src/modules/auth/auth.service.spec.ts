import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/decorators/roles/emuns/role.enum';
import { DatabaseService } from 'src/db/service/database.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService, DatabaseService, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Unit tests', () => {
    it('should return access token when username and password match', async () => {
      const mockUser = {
        id: 1,
        username: 'test',
        password: 'password',
        roles: Role.User,
      };
      const mockAccessToken = 'mockAccessToken';

      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockImplementation(async () => mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockAccessToken);

      const result = await service.signIn('test', 'password');

      expect(usersService.findOneByUsername).toHaveBeenCalledWith('test');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        mockUser.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
      });
      expect(result).toEqual({ access_token: mockAccessToken });
    });

    it('should throw UnauthorizedException when username and password do not match', async () => {
      const mockUser = {
        id: 1,
        username: 'test',
        password: 'password',
        roles: Role.User,
      };

      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockImplementation(async () => mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(
        service.signIn('test', 'incorrectPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
