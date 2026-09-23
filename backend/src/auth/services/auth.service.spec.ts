import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AgentsService } from '../../agents/services/agents.service.js';
import { AuthService } from './auth.service.js';
import { Agent } from '../../agents/entities/agent.entity.js';

type MockFunction = jest.Mock<(...args: any[]) => any>;

describe('AuthService', () => {
  let service: AuthService;
  let agentsService: { findOneByEmail: MockFunction };
  let jwtService: { sign: MockFunction };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    agentsService = {
      findOneByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AgentsService,
          useValue: agentsService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user when the password is valid', async () => {
      const password = 'correct-password';
      const user = {
        id: 1,
        email: 'agent@example.com',
        password: await bcrypt.hash(password, 4),
      } as Agent;
      agentsService.findOneByEmail.mockResolvedValue(user);

      await expect(
        service.validateUser(user.email, password),
      ).resolves.toBe(user);
      expect(agentsService.findOneByEmail).toHaveBeenCalledWith(user.email);
    });

    it('should throw UnauthorizedException when the user does not exist', async () => {
      agentsService.findOneByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('missing@example.com', 'password'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should return null when the password is invalid', async () => {
      const user = {
        id: 1,
        email: 'agent@example.com',
        password: await bcrypt.hash('correct-password', 4),
      } as Agent;
      agentsService.findOneByEmail.mockResolvedValue(user);

      await expect(
        service.validateUser(user.email, 'wrong-password'),
      ).resolves.toBeNull();
    });

    it('should propagate errors from AgentsService', async () => {
      const error = new Error('Database unavailable');
      agentsService.findOneByEmail.mockRejectedValue(error);

      await expect(
        service.validateUser('agent@example.com', 'password'),
      ).rejects.toBe(error);
    });
  });

  describe('generateToken', () => {
    it('should sign a token with the user id as subject', () => {
      const user = { id: 7 } as Agent;
      jwtService.sign.mockReturnValue('signed-token');

      expect(service.generateToken(user)).toBe('signed-token');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 7 });
    });

    it('should propagate errors from JwtService', () => {
      const error = new Error('Token generation failed');
      jwtService.sign.mockImplementation(() => {
        throw error;
      });

      expect(() => service.generateToken({ id: 7 } as Agent)).toThrow(error);
    });
  });
});
