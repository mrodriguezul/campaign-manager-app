import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import type { LoginDto } from '../dto/login.dto.js';
import type { Agent } from '../../agents/entities/agent.entity.js';

type MockFunction = jest.Mock<(...args: any[]) => any>;

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { generateToken: MockFunction };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    authService = {
      generateToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return the authenticated user and access token', async () => {
      const user = { id: 1, email: 'agent@example.com' } as Agent;
      const body = {
        email: user.email,
        password: 'password',
      } as LoginDto;
      authService.generateToken.mockReturnValue('signed-token');

      await expect(
        controller.login({ user } as never, body),
      ).resolves.toEqual({
        user,
        access_token: 'signed-token',
      });
      expect(authService.generateToken).toHaveBeenCalledWith(user);
    });

    it('should propagate token generation errors', async () => {
      const user = { id: 1, email: 'agent@example.com' } as Agent;
      const error = new Error('Token generation failed');
      authService.generateToken.mockImplementation(() => {
        throw error;
      });

      await expect(
        controller.login({ user } as never, {
          email: user.email,
          password: 'password',
        }),
      ).rejects.toBe(error);
    });

    it('should pass the request user to the token service', async () => {
      const user = { id: 2 } as Agent;
      const body = { email: 'agent@example.com', password: 'password' };
      authService.generateToken.mockReturnValue('another-token');

      await controller.login({ user } as never, body);

      expect(authService.generateToken).toHaveBeenCalledTimes(1);
      expect(authService.generateToken).toHaveBeenCalledWith(user);
    });
  });
});
