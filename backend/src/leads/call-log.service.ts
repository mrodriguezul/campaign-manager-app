import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CallLog } from './entities/call-log.entity.js';
import { Lead } from './entities/lead.entity.js';
import { CreateCallLogDto } from './dto/create-call-log.dto.js';
import { AgentsService } from '../agents/agents.service.js';

@Injectable()
export class CallLogService {
  constructor(
    @InjectRepository(CallLog)
    private callLogsRepository: Repository<CallLog>,
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
    private agentsService: AgentsService,
  ) {}

  async create(leadId: number, createCallLogDto: CreateCallLogDto) {
    const lead = await this.leadsRepository.findOneBy({ id: leadId });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const agent = await this.agentsService.findById(createCallLogDto.agentId);

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    try {
      const newCallLog = this.callLogsRepository.create({
        status: createCallLogDto.status,
        notes: createCallLogDto.notes,
        lead,
        agent,
      });
      return await this.callLogsRepository.save(newCallLog);
    } catch {
      throw new BadRequestException('Error creating call log ...');
    }
  }

  async getCallLogsByLeadId(id: number){
    const lead = await this.leadsRepository.findOne({
      where: {id},
      relations: {
        callLogs: {
          agent: true
        }
      }
    });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }    
    return lead.callLogs;
  }
}
