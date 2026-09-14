import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CallLog } from '../entities/call-log.entity.js';
import { Lead } from '../entities/lead.entity.js';
import { CreateCallLogDto } from '../dto/create-call-log.dto.js';
import { AgentsService } from '../../agents/services/agents.service.js';
import { PromptService } from '../../ai/services/prompt.service.js';
import { GeminiService } from '../../ai/services/gemini.service.js';
import { CallLogResponse } from '../../ai/model/call-log-response.model.js';

@Injectable()
export class CallLogService {
  constructor(
    @InjectRepository(CallLog)
    private callLogsRepository: Repository<CallLog>,
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
    private agentsService: AgentsService,
    private promptsService: PromptService,
    private geminiService: GeminiService
  ) {}

  async create(leadId: number, createCallLogDto: CreateCallLogDto, idAgent: number) {
    const lead = await this.leadsRepository.findOneBy({ id: leadId });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    
    const agent = await this.agentsService.findById(idAgent);
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const rawNotes = createCallLogDto.notes as string;
    const prompt = this.promptsService.getPrompt('call-log', { rawNotes });

    const aiResponse = await this.geminiService.generateResponse(prompt) as CallLogResponse;

    try {
      const newCallLog = this.callLogsRepository.create({
        
        notes: createCallLogDto.notes,
        status: aiResponse.status,
        summary: aiResponse.summary,
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
