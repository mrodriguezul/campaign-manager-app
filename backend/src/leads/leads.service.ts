import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { ConfigService } from '@nestjs/config';
import { Env } from '../env.model.js';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LeadsService {
    constructor(
      @InjectRepository(Lead)
      private leadsRepository: Repository<Lead>,
      private configService: ConfigService<Env>){}

  //const key = this.configService.get("KEY_APP");

  async findAll() {
    const leads = await this.leadsRepository.find();
    return leads
  }

  async findById(id: number) {
    const lead = await this.getLead(id);
    return lead;
  }

  async create(lead: CreateLeadDto){    
    try{
      const newLead = await this.leadsRepository.save(lead);
      return newLead;
    }catch{
      throw new BadRequestException("Error creating lead ...")
    }
  }

  async update(id: number, lead: UpdateLeadDto) {
    const leadFound = await this.getLead(id);

    if (
      (lead.name != undefined && lead.name.trim().length === 0) ||
      (lead.phone != undefined && lead.phone.trim().length === 0) ||
      (lead.context != undefined && lead.context.trim().length === 0)
    ) {
      throw new UnprocessableEntityException(
        'Name, phone and context cannot be empty',
      );
    }

    const updatedLead = this.leadsRepository.merge(leadFound, lead);    
    return this.leadsRepository.save(updatedLead);
  }

  async delete(id: number) {
    const lead = await this.getLead(id);
    await this.leadsRepository.delete(lead.id);
    
    return {
      message: 'Lead deleted successfully',
    };
  }

  async getCallLogsByLeadId(id: number){
    const lead = await this.leadsRepository.findOne({
      where: {id},
      relations: {
        callLogs: true
      }
    });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }    
    return lead.callLogs;
  }

  private async getLead(id: number) {
    const lead = await this.leadsRepository.findOneBy({ id })
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    return lead;
  }
}
