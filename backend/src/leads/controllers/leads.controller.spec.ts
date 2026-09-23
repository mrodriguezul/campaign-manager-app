import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { LeadsController } from './leads.controller.js';
import { LeadsService } from '../services/leads.service.js';
import { CallLogService } from '../services/call-log.service.js';
import type { CreateCallLogDto } from '../dto/create-call-log.dto.js';
import type { CreateLeadDto } from '../dto/create-lead.dto.js';

type MockFunction = jest.Mock<(...args: any[]) => any>;

describe('LeadsController', () => {
  let controller: LeadsController;
  let leadsService: {
    findAll: MockFunction;
    findById: MockFunction;
    create: MockFunction;
    update: MockFunction;
    delete: MockFunction;
  };
  let callLogService: {
    getCallLogsByLeadId: MockFunction;
    create: MockFunction;
  };

  beforeEach(async () => {
    leadsService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    callLogService = {
      getCallLogsByLeadId: jest.fn(),
      create: jest.fn(),
    };
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadsController],
      providers: [
        {
          provide: LeadsService,
          useValue: leadsService,
        },
        {
          provide: CallLogService,
          useValue: callLogService,
        },
      ],
    }).compile();

    controller = module.get<LeadsController>(LeadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all leads', async () => {
    const leads = [{ id: 1, name: 'Lead 1' }];
    leadsService.findAll.mockResolvedValue(leads);

    await expect(controller.getLeads()).resolves.toBe(leads);
    expect(leadsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors when finding all leads fails', async () => {
    const error = new Error('Database error');
    leadsService.findAll.mockRejectedValue(error);

    await expect(controller.getLeads()).rejects.toBe(error);
  });

  it('should return a lead by id', async () => {
    const lead = { id: 7, name: 'Lead 7' };
    leadsService.findById.mockResolvedValue(lead);

    await expect(controller.getLeadsById(7)).resolves.toBe(lead);
    expect(leadsService.findById).toHaveBeenCalledWith(7);
  });

  it('should propagate errors when finding a lead by id fails', async () => {
    const error = new Error('Lead not found');
    leadsService.findById.mockRejectedValue(error);

    await expect(controller.getLeadsById(7)).rejects.toBe(error);
  });

  it('should return call logs for a lead', async () => {
    const callLogs = [{ id: 3, notes: 'Follow-up' }];
    callLogService.getCallLogsByLeadId.mockResolvedValue(callLogs);

    await expect(controller.getCallLogsByLeadId(7)).resolves.toBe(callLogs);
    expect(callLogService.getCallLogsByLeadId).toHaveBeenCalledWith(7);
  });

  it('should propagate errors when finding call logs fails', async () => {
    const error = new Error('Call logs unavailable');
    callLogService.getCallLogsByLeadId.mockRejectedValue(error);

    await expect(controller.getCallLogsByLeadId(7)).rejects.toBe(error);
  });

  it('should create a call log with the lead and authenticated agent ids', async () => {
    const callLog = { id: 4, notes: 'Call notes' };
    const createCallLogDto = { status: "Status detail", notes: 'Call notes' };
    const request = { user: { userId: 11 } } as never;
    callLogService.create.mockResolvedValue(callLog);

    await expect(
      controller.createCallLog(7, createCallLogDto, request),
    ).resolves.toBe(callLog);
    expect(callLogService.create).toHaveBeenCalledWith(
      7,
      createCallLogDto,
      11,
    );
  });

  it('should propagate errors when creating a call log fails', async () => {
    const error = new Error('Call log could not be created');
    const incompleteCallLogDto = {  notes: 'Call notes' } as CreateCallLogDto; 

    callLogService.create.mockRejectedValue(error);

    await expect(
      controller.createCallLog(7, incompleteCallLogDto, {
        user: { userId: 11 },
      } as never),
    ).rejects.toBe(error);
  });

  it('should create a lead', async () => {
    const leadDto = { name: 'New lead', phone: '555-0100', context: 'Sales' };
    const lead = { id: 8, ...leadDto };
    leadsService.create.mockResolvedValue(lead);

    await expect(controller.createLead(leadDto)).resolves.toBe(lead);
    expect(leadsService.create).toHaveBeenCalledWith(leadDto);
  });

  it('should propagate errors when creating a lead fails', async () => {
    const error = new Error('Lead could not be created');
    const incompleteLeadDto = { name: 'New lead' } as CreateLeadDto;
    leadsService.create.mockRejectedValue(error);

    await expect(controller.createLead(incompleteLeadDto)).rejects.toBe(
      error,
    );
  });

  it('should update a lead', async () => {
    const leadDto = { name: 'Updated lead' };
    const lead = { id: 8, ...leadDto };
    leadsService.update.mockResolvedValue(lead);

    await expect(controller.updateLead(8, leadDto)).resolves.toBe(lead);
    expect(leadsService.update).toHaveBeenCalledWith(8, leadDto);
  });

  it('should propagate errors when updating a lead fails', async () => {
    const error = new Error('Lead could not be updated');
    leadsService.update.mockRejectedValue(error);

    await expect(controller.updateLead(8, { name: 'Updated lead' })).rejects.toBe(
      error,
    );
  });

  it('should delete a lead', async () => {
    const result = { message: 'Lead deleted successfully' };
    leadsService.delete.mockResolvedValue(result);

    await expect(controller.deleteLead(8)).resolves.toBe(result);
    expect(leadsService.delete).toHaveBeenCalledWith(8);
  });

  it('should propagate errors when deleting a lead fails', async () => {
    const error = new Error('Lead could not be deleted');
    leadsService.delete.mockRejectedValue(error);

    await expect(controller.deleteLead(8)).rejects.toBe(error);
  });
});