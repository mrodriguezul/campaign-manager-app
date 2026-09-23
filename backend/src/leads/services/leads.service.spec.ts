import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LeadsService } from './leads.service.js';
import { Lead } from '../entities/lead.entity.js';

type MockFunction = jest.Mock<(...args: any[]) => any>;

describe('LeadsService', () => {
  let service: LeadsService;
  let leadsRepository: {
    save: MockFunction;
    find: MockFunction;
    findOneBy: MockFunction;
    merge: MockFunction;
    delete: MockFunction;
  };
  const configService = { get: jest.fn() };

  beforeEach(async () => {
    leadsRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    };
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: getRepositoryToken(Lead),
          useValue: leadsRepository,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all leads', async () => {
    const leads = [{ id: 1, name: 'Lead 1' }];
    leadsRepository.find.mockResolvedValue(leads);

    await expect(service.findAll()).resolves.toBe(leads);
    expect(leadsRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should propagate repository errors when finding all leads', async () => {
    const error = new Error('Database error');
    leadsRepository.find.mockRejectedValue(error);

    await expect(service.findAll()).rejects.toBe(error);
  });

  it('should return a lead by id', async () => {
    const lead = { id: 1, name: 'Lead 1' };
    leadsRepository.findOneBy.mockResolvedValue(lead);

    await expect(service.findById(1)).resolves.toBe(lead);
    expect(leadsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw NotFoundException when the lead does not exist', async () => {
    leadsRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findById(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should create and return a lead', async () => {
    const leadDto = { name: 'New lead', phone: '555-0100', context: 'Sales' };
    const savedLead = { id: 2, ...leadDto };
    leadsRepository.save.mockResolvedValue(savedLead);

    await expect(service.create(leadDto)).resolves.toBe(savedLead);
    expect(leadsRepository.save).toHaveBeenCalledWith(leadDto);
  });

  it('should throw BadRequestException when creating a lead fails', async () => {
    leadsRepository.save.mockRejectedValue(new Error('Database error'));

    await expect(
      service.create({
        name: 'New lead',
        phone: '+15550100',
        context: 'Sales',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should update and return a lead', async () => {
    const existingLead = { id: 1, name: 'Old name' };
    const leadDto = { name: 'New name' };
    const updatedLead = { id: 1, name: 'New name' };
    leadsRepository.findOneBy.mockResolvedValue(existingLead);
    leadsRepository.merge.mockReturnValue(updatedLead);
    leadsRepository.save.mockResolvedValue(updatedLead);

    await expect(service.update(1, leadDto)).resolves.toBe(updatedLead);
    expect(leadsRepository.merge).toHaveBeenCalledWith(existingLead, leadDto);
    expect(leadsRepository.save).toHaveBeenCalledWith(updatedLead);
  });

  it('should throw NotFoundException when updating a missing lead', async () => {
    leadsRepository.findOneBy.mockResolvedValue(null);

    await expect(service.update(1, { name: 'New name' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should throw UnprocessableEntityException for empty update fields', async () => {
    leadsRepository.findOneBy.mockResolvedValue({ id: 1, name: 'Old name' });

    await expect(service.update(1, { name: '   ' })).rejects.toBeInstanceOf(
      UnprocessableEntityException,
    );
    expect(leadsRepository.merge).not.toHaveBeenCalled();
  });

  it('should propagate save errors when updating a lead', async () => {
    const existingLead = { id: 1, name: 'Old name' };
    leadsRepository.findOneBy.mockResolvedValue(existingLead);
    leadsRepository.merge.mockReturnValue({ id: 1, name: 'New name' });
    leadsRepository.save.mockRejectedValue(new Error('Database error'));

    await expect(service.update(1, { name: 'New name' })).rejects.toThrow(
      'Database error',
    );
  });

  it('should delete a lead and return a confirmation message', async () => {
    const lead = { id: 1, name: 'Lead 1' };
    leadsRepository.findOneBy.mockResolvedValue(lead);
    leadsRepository.delete.mockResolvedValue({ affected: 1 });

    await expect(service.delete(1)).resolves.toEqual({
      message: 'Lead deleted successfully',
    });
    expect(leadsRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when deleting a missing lead', async () => {
    leadsRepository.findOneBy.mockResolvedValue(null);

    await expect(service.delete(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should propagate repository errors when deleting a lead', async () => {
    leadsRepository.findOneBy.mockResolvedValue({ id: 1, name: 'Lead 1' });
    leadsRepository.delete.mockRejectedValue(new Error('Database error'));

    await expect(service.delete(1)).rejects.toThrow('Database error');
  });
});
