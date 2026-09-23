import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CallLogService } from './call-log.service.js';
import { CallLog } from '../entities/call-log.entity.js';
import { Lead } from '../entities/lead.entity.js';
import { AgentsService } from '../../agents/services/agents.service.js';
import { PromptService } from '../../ai/services/prompt.service.js';
import { GeminiService } from '../../ai/services/gemini.service.js';
import type { CreateCallLogDto } from '../dto/create-call-log.dto.js';

type MockFunction = jest.Mock<(...args: any[]) => any>;

describe('CallLogService', () => {
  let service: CallLogService;
  let callLogsRepository: {
    create: MockFunction;
    save: MockFunction;
  };
  let leadsRepository: {
    findOneBy: MockFunction;
    findOne: MockFunction;
  };
  let agentsService: {
    findById: MockFunction;
  };
  let promptsService: {
    getPrompt: MockFunction;
  };
  let geminiService: {
    generateResponse: MockFunction;
  };

  const lead = {
    id: 1,
    name: 'Lead 1',
    phone: '+15550100',
    context: 'Sales follow-up',
  };
  const agent = {
    id: 2,
    name: 'Agent 1',
    email: 'agent@example.com',
  };
  const createCallLogDto: CreateCallLogDto = {
    status: 'completed',
    notes: 'Customer requested a follow-up.',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    callLogsRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };
    leadsRepository = {
      findOneBy: jest.fn(),
      findOne: jest.fn(),
    };
    agentsService = {
      findById: jest.fn(),
    };
    promptsService = {
      getPrompt: jest.fn(),
    };
    geminiService = {
      generateResponse: jest.fn(),
    };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CallLogService,
        {
          provide: getRepositoryToken(CallLog),
          useValue: callLogsRepository,
        },
        {
          provide: getRepositoryToken(Lead),
          useValue: leadsRepository,
        },
        {
          provide: AgentsService,
          useValue: agentsService,
        },
        {
          provide: PromptService,
          useValue: promptsService,
        },
        {
          provide: GeminiService,
          useValue: geminiService,
        },
      ],
    }).compile();

    service = module.get<CallLogService>(CallLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException when the lead does not exist', async () => {
      leadsRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.create(1, createCallLogDto, 2),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(agentsService.findById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when the agent does not exist', async () => {
      leadsRepository.findOneBy.mockResolvedValue(lead);
      agentsService.findById.mockResolvedValue(null);

      await expect(
        service.create(1, createCallLogDto, 2),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(agentsService.findById).toHaveBeenCalledWith(2);
    });

    it('should create and save a call log', async () => {
      const prompt = 'Rendered call-log prompt';
      const aiResponse = {
        status: 'completed',
        summary: 'Customer requested a follow-up.',
      };
      const newCallLog = { id: 3, ...createCallLogDto, lead, agent };
      const savedCallLog = { ...newCallLog };

      leadsRepository.findOneBy.mockResolvedValue(lead);
      agentsService.findById.mockResolvedValue(agent);
      promptsService.getPrompt.mockReturnValue(prompt);
      geminiService.generateResponse.mockResolvedValue(aiResponse);
      callLogsRepository.create.mockReturnValue(newCallLog);
      callLogsRepository.save.mockResolvedValue(savedCallLog);

      await expect(
        service.create(1, createCallLogDto, 2),
      ).resolves.toBe(savedCallLog);
      expect(leadsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(agentsService.findById).toHaveBeenCalledWith(2);
      expect(promptsService.getPrompt).toHaveBeenCalledWith('call-log', {
        rawNotes: createCallLogDto.notes,
      });
      expect(geminiService.generateResponse).toHaveBeenCalledWith(prompt);
      expect(callLogsRepository.create).toHaveBeenCalledWith({
        notes: createCallLogDto.notes,
        status: aiResponse.status,
        summary: aiResponse.summary,
        lead,
        agent,
      });
      expect(callLogsRepository.save).toHaveBeenCalledWith(newCallLog);
    });

    it('should propagate prompt service errors', async () => {
      const error = new Error('Prompt unavailable');
      leadsRepository.findOneBy.mockResolvedValue(lead);
      agentsService.findById.mockResolvedValue(agent);
      promptsService.getPrompt.mockImplementation(() => {
        throw error;
      });

      await expect(
        service.create(1, createCallLogDto, 2),
      ).rejects.toBe(error);
      expect(geminiService.generateResponse).not.toHaveBeenCalled();
    });

    it('should propagate Gemini service errors', async () => {
      const error = new Error('Gemini unavailable');
      leadsRepository.findOneBy.mockResolvedValue(lead);
      agentsService.findById.mockResolvedValue(agent);
      promptsService.getPrompt.mockReturnValue('Rendered prompt');
      geminiService.generateResponse.mockRejectedValue(error);

      await expect(
        service.create(1, createCallLogDto, 2),
      ).rejects.toBe(error);
      expect(callLogsRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when creating the call log fails', async () => {
      leadsRepository.findOneBy.mockResolvedValue(lead);
      agentsService.findById.mockResolvedValue(agent);
      promptsService.getPrompt.mockReturnValue('Rendered prompt');
      geminiService.generateResponse.mockResolvedValue({
        status: 'completed',
        summary: 'Summary',
      });
      callLogsRepository.create.mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(
        service.create(1, createCallLogDto, 2),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException when saving the call log fails', async () => {
      const newCallLog = { id: 3 };
      leadsRepository.findOneBy.mockResolvedValue(lead);
      agentsService.findById.mockResolvedValue(agent);
      promptsService.getPrompt.mockReturnValue('Rendered prompt');
      geminiService.generateResponse.mockResolvedValue({
        status: 'completed',
        summary: 'Summary',
      });
      callLogsRepository.create.mockReturnValue(newCallLog);
      callLogsRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(
        service.create(1, createCallLogDto, 2),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('getCallLogsByLeadId', () => {
    it('should return the lead call logs with agents loaded', async () => {
      const callLogs = [{ id: 3, notes: 'Follow-up', agent }];
      leadsRepository.findOne.mockResolvedValue({ ...lead, callLogs });

      await expect(service.getCallLogsByLeadId(1)).resolves.toBe(callLogs);
      expect(leadsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: {
          callLogs: {
            agent: true,
          },
        },
      });
    });

    it('should return an empty array when the lead has no call logs', async () => {
      const callLogs: never[] = [];
      leadsRepository.findOne.mockResolvedValue({ ...lead, callLogs });

      await expect(service.getCallLogsByLeadId(1)).resolves.toBe(callLogs);
    });

    it('should throw NotFoundException when the lead does not exist', async () => {
      leadsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getCallLogsByLeadId(1),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database error');
      leadsRepository.findOne.mockRejectedValue(error);

      await expect(service.getCallLogsByLeadId(1)).rejects.toBe(error);
    });
  });
});
