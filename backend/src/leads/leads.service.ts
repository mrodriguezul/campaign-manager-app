import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { Lead } from './lead.model.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { ConfigService } from '@nestjs/config';
import { Env } from '../env.model.js';

@Injectable()
export class LeadsService {
    constructor(private configService: ConfigService<Env>){}
    private leads: Lead[] = [
        {
        id: '1',
        name: 'John Doe',
        phone: '1234567890',
        context: 'promo internet',
        createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
        id: '2',
        name: 'Jane Doe',
        phone: '0987654321',
        context: 'debt collection',
        createdAt: new Date(),
        updatedAt: new Date(),
        },
    ];

  getLastLeadsIdIndex() {
    const key = this.configService.get("KEY_APP");
    if (this.leads.length === 0) {
      return 1;
    }
    return this.leads.length + 1;
  }

  findAll(): Lead[] {
    return this.leads;
  }

  findById(id: string): Lead {
    const index = this.getLeadPosition(id);
    return this.leads[index];
  }

  create(lead: CreateLeadDto): Lead {
    const leadCreated: Lead = {
      id: this.getLastLeadsIdIndex().toString(),
      name: lead.name,
      phone: lead.phone,
      context: lead.context,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(leadCreated);
    this.leads.push(leadCreated);
    return leadCreated;
  }

  update(id: string, lead: UpdateLeadDto): Lead {
    const index = this.getLeadPosition(id);

    if (
      (lead.name != undefined && lead.name.trim().length === 0) ||
      (lead.phone != undefined && lead.phone.trim().length === 0) ||
      (lead.context != undefined && lead.context.trim().length === 0)
    ) {
      throw new UnprocessableEntityException(
        'Name, phone and context cannot be empty',
      );
    }

    const updatedLead = { ...this.leads[index], ...lead };
    updatedLead.updatedAt = new Date();
    this.leads[index] = updatedLead;
    return updatedLead;
  }

  delete(id: string) {
    const index = this.getLeadPosition(id);
    this.leads = this.leads.filter((lead) => lead.id !== id);
    return {
      message: 'Lead deleted successfully',
    };
  }

  private getLeadPosition(id: String) {
    const position = this.leads.findIndex((lead) => lead.id === id);
    if (position === -1) {
      throw new NotFoundException('Lead not found');
    }
    return position;
  }
}
