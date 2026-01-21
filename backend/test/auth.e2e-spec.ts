import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import request from 'supertest';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';

describe('Auth (e2e) - login', () => {
  let application: INestApplication;

  const jwtServiceMock: Partial<JwtService> = {
    sign: jest.fn(() => 'test_token'),
  };

  const usersServiceMock: Partial<UsersService> = {
    findByEmail: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    application = moduleRef.createNestApplication();
    await application.init();
  });

  afterAll(async () => {
    await application.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /auth/login -> 201 + token quand credentials OK', async () => {
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    (usersServiceMock.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@mail.com',
      password: hashedPassword,
      role: 'USER',
    });

    const response = await request(application.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@mail.com', password: plainPassword })
      .expect(201);

    expect(response.body.access_token).toBe('test_token');
    expect(jwtServiceMock.sign).toHaveBeenCalledTimes(1);
    expect(response.body.sub).toBe(1);
    expect(response.body.email).toBe('test@mail.com');
    expect(response.body.role).toBe('USER');
  });

  it('POST /auth/login -> 401 si email inconnu', async () => {
    (usersServiceMock.findByEmail as jest.Mock).mockResolvedValue(null);

    const response = await request(application.getHttpServer())
      .post('/auth/login')
      .send({ email: 'unknown@mail.com', password: 'whatever' })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
  });

  it('POST /auth/login -> 401 si mauvais mot de passe', async () => {
    const hashedPassword = await bcrypt.hash('correct', 10);

    (usersServiceMock.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@mail.com',
      password: hashedPassword,
      role: 'USER',
    });

    const response = await request(application.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@mail.com', password: 'wrong' })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
  });
});
