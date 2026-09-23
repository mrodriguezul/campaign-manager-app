import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AgentsController } from './agents.controller.js';
import { AgentsService } from '../services/agents.service.js';
import type { CreateAgentDto } from '../dto/create-agent.dto.js';
import type { UpdateAgentDto } from '../dto/update-agent.dto.js';

type MockFunction = jest.Mock<(...args: any[]) => any>;

describe('AgentsController', () => {
  let controller: AgentsController;
  let agentsService: {
    findAll: MockFunction;
    findById: MockFunction;
    create: MockFunction;
    update: MockFunction;
    delete: MockFunction;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    agentsService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [
        {
          provide: AgentsService,
          useValue: agentsService,
        },
      ],
    }).compile();

    controller = module.get<AgentsController>(AgentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAgents', () => {
    it('should return all agents', async () => {
      const agents = [{ id: 1, name: 'Agent 1' }];
      agentsService.findAll.mockResolvedValue(agents);

      await expect(controller.getAgents()).resolves.toBe(agents);
      expect(agentsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Database error');
      agentsService.findAll.mockRejectedValue(error);

      await expect(controller.getAgents()).rejects.toBe(error);
    });
  });

  describe('getAgentById', () => {
    it('should return an agent by id', async () => {
      const agent = { id: 1, name: 'Agent 1' };
      agentsService.findById.mockResolvedValue(agent);

      await expect(controller.getAgentById(1)).resolves.toBe(agent);
      expect(agentsService.findById).toHaveBeenCalledWith(1);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Agent not found');
      agentsService.findById.mockRejectedValue(error);

      await expect(controller.getAgentById(1)).rejects.toBe(error);
    });
  });

  describe('createAgent', () => {
    it('should create and return an agent', async () => {
      const agentDto = {
        name: 'Agent 1',
        email: 'agent@example.com',
        password: 'password123',
      } as CreateAgentDto;
      const agent = { id: 1, ...agentDto };
      agentsService.create.mockResolvedValue(agent);

      await expect(controller.createAgent(agentDto)).resolves.toBe(agent);
      expect(agentsService.create).toHaveBeenCalledWith(agentDto);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Agent could not be created');
      const incompleteAgent = { name: 'Agent 1' } as CreateAgentDto;
      agentsService.create.mockRejectedValue(error);

      await expect(controller.createAgent(incompleteAgent)).rejects.toBe(error);
    });
  });

  describe('updateAgent', () => {
    it('should update and return an agent', async () => {
      const agentDto = { name: 'Updated agent' } as UpdateAgentDto;
      const agent = { id: 1, name: 'Updated agent' };
      agentsService.update.mockResolvedValue(agent);

      await expect(controller.updateAgent(1, agentDto)).resolves.toBe(agent);
      expect(agentsService.update).toHaveBeenCalledWith(1, agentDto);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Agent could not be updated');
      agentsService.update.mockRejectedValue(error);

      await expect(
        controller.updateAgent(1, { email: 'updated@example.com' }),
      ).rejects.toBe(error);
    });
  });

  describe('deleteAgent', () => {
    it('should delete an agent and return the service result', async () => {
      const result = { message: 'Agent deleted successfully' };
      agentsService.delete.mockResolvedValue(result);

      await expect(controller.deleteAgent(1)).resolves.toBe(result);
      expect(agentsService.delete).toHaveBeenCalledWith(1);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Agent could not be deleted');
      agentsService.delete.mockRejectedValue(error);

      await expect(controller.deleteAgent(1)).rejects.toBe(error);
    });
  });
});
