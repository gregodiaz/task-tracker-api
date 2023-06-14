import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/db/service/database.service';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        DatabaseService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Unit tests', () => {
    it('should return access token when username and password are valid', async () => {
      const mockSignInDto: SignInDto = {
        username: 'test',
        password: 'password',
      };
      const mockAccessToken = 'mockAccessToken';

      jest
        .spyOn(authService, 'signIn')
        .mockResolvedValue({ access_token: mockAccessToken });

      const result = await controller.signIn(mockSignInDto);

      expect(authService.signIn).toHaveBeenCalledWith(
        mockSignInDto.username,
        mockSignInDto.password,
      );
      expect(result).toEqual({ access_token: mockAccessToken });
    });

    it('should throw UnauthorizedException when username and password are invalid', async () => {
      const mockSignInDto: SignInDto = {
        username: 'test',
        password: 'invalidPassword',
      };

      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new UnauthorizedException());

      await expect(controller.signIn(mockSignInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return the user profile', () => {
      const mockUser = { id: 1, username: 'test' };
      const mockRequest = { user: mockUser };

      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(mockUser);
    });
  });
});
