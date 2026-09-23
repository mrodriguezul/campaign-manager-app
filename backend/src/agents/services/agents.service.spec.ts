import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { AgentsService } from './agents.service.js';
import { Agent } from '../entities/agent.entity.js';

type MockFunction = jest.Mock<(...args: any[]) => any>;

describe('AgentsService', () => {
  let service: AgentsService;
  let agentsRepository: {
    find: MockFunction;
    findOneBy: MockFunction;
    findOne: MockFunction;
    create: MockFunction;
    save: MockFunction;
    merge: MockFunction;
    delete: MockFunction;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    agentsRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentsService,
        {
          provide: getRepositoryToken(Agent),
          useValue: agentsRepository,
        },
      ],
    }).compile();

    service = module.get<AgentsService>(AgentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all agents', async () => {
      const agents = [{ id: 1, name: 'Agent 1' }];
      agentsRepository.find.mockResolvedValue(agents);

      await expect(service.findAll()).resolves.toBe(agents);
      expect(agentsRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database error');
      agentsRepository.find.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toBe(error);
    });
  });

  describe('findById', () => {
    it('should return an agent by id', async () => {
      const agent = { id: 1, name: 'Agent 1' };
      agentsRepository.findOneBy.mockResolvedValue(agent);

      await expect(service.findById(1)).resolves.toBe(agent);
      expect(agentsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when the agent does not exist', async () => {
      agentsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and save an agent', async () => {
      const agentDto = {
        name: 'Agent 1',
        email: 'agent@example.com',
        password: 'password123',
      };
      const newAgent = { id: 1, ...agentDto };
      agentsRepository.create.mockReturnValue(newAgent);
      agentsRepository.save.mockResolvedValue(newAgent);

      await expect(service.create(agentDto)).resolves.toBe(newAgent);
      expect(agentsRepository.create).toHaveBeenCalledWith(agentDto);
      expect(agentsRepository.save).toHaveBeenCalledWith(newAgent);
    });

    it('should throw BadRequestException when create fails', async () => {
      agentsRepository.create.mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(
        service.create({
          name: 'Agent 1',
          email: 'agent@example.com',
          password: 'password123',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException when save fails', async () => {
      const newAgent = { id: 1, name: 'Agent 1' };
      agentsRepository.create.mockReturnValue(newAgent);
      agentsRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(
        service.create({
          name: 'Agent 1',
          email: 'agent@example.com',
          password: 'password123',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('update', () => {
    it('should merge, save and return the updated agent', async () => {
      const existingAgent = { id: 1, name: 'Old agent' };
      const updateDto = { name: 'Updated agent' };
      const updatedAgent = { id: 1, name: 'Updated agent' };
      agentsRepository.findOneBy.mockResolvedValue(existingAgent);
      agentsRepository.merge.mockReturnValue(updatedAgent);
      agentsRepository.save.mockResolvedValue(updatedAgent);

      await expect(service.update(1, updateDto)).resolves.toBe(updatedAgent);
      expect(agentsRepository.merge).toHaveBeenCalledWith(
        existingAgent,
        updateDto,
      );
      expect(agentsRepository.save).toHaveBeenCalledWith(updatedAgent);
    });

    it('should throw NotFoundException when updating a missing agent', async () => {
      agentsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(1, { name: 'Updated agent' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw UnprocessableEntityException for an empty name', async () => {
      agentsRepository.findOneBy.mockResolvedValue({ id: 1, name: 'Agent 1' });

      await expect(service.update(1, { name: '   ' })).rejects.toBeInstanceOf(
        UnprocessableEntityException,
      );
      expect(agentsRepository.merge).not.toHaveBeenCalled();
    });

    it('should throw UnprocessableEntityException for an empty email', async () => {
      agentsRepository.findOneBy.mockResolvedValue({ id: 1, name: 'Agent 1' });

      await expect(
        service.update(1, { email: '   ' }),
      ).rejects.toBeInstanceOf(UnprocessableEntityException);
      expect(agentsRepository.merge).not.toHaveBeenCalled();
    });

    it('should propagate save errors', async () => {
      agentsRepository.findOneBy.mockResolvedValue({ id: 1, name: 'Agent 1' });
      agentsRepository.merge.mockReturnValue({ id: 1, name: 'Updated agent' });
      agentsRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.update(1, { name: 'Updated agent' })).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('delete', () => {
    it('should delete an agent and return a confirmation message', async () => {
      agentsRepository.findOneBy.mockResolvedValue({ id: 1, name: 'Agent 1' });
      agentsRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.delete(1)).resolves.toEqual({
        message: 'Agent deleted successfully',
      });
      expect(agentsRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when deleting a missing agent', async () => {
      agentsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should propagate repository errors', async () => {
      agentsRepository.findOneBy.mockResolvedValue({ id: 1, name: 'Agent 1' });
      agentsRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(service.delete(1)).rejects.toThrow('Database error');
    });
  });

  describe('findOneByEmail', () => {
    it('should return the agent matching the email', async () => {
      const agent = { id: 1, email: 'agent@example.com' };
      agentsRepository.findOne.mockResolvedValue(agent);

      await expect(service.findOneByEmail(agent.email)).resolves.toBe(agent);
      expect(agentsRepository.findOne).toHaveBeenCalledWith({
        where: { email: agent.email },
      });
    });

    it('should return null when no agent matches the email', async () => {
      agentsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOneByEmail('missing@example.com'),
      ).resolves.toBeNull();
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database error');
      agentsRepository.findOne.mockRejectedValue(error);

      await expect(
        service.findOneByEmail('agent@example.com'),
      ).rejects.toBe(error);
    });
  });
});