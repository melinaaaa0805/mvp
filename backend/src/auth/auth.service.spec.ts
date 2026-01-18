import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException when email format is invalid', async () => {
    await expect(
      service.login('invalid-email-format', 'password123'),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    // optionnel : vérifier qu’on ne va même pas taper la BDD
    expect(usersService.findByEmail).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login('test@example.com', 'password123'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'USER',
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login('test@example.com', 'wrongPassword'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should return a JWT token and user info when credentials are valid', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'USER',
    } as any;

    usersService.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('fake-jwt-token');

    const result = await service.login('test@example.com', 'password123');

    expect(result).toEqual({
      access_token: 'fake-jwt-token',
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password);
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  });
});
