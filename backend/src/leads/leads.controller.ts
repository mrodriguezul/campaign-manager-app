import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { LeadsService } from './leads.service.js';
import { ConfigService } from '@nestjs/config';
import type { Lead } from './lead.model.js';


@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Get()
  getLeads(): Lead[] {
    return this.leadsService.findAll();
  }

  @Get(':id')
  getLeadsById(@Param('id') id: string): Lead {
    return this.leadsService.findById(id);
  }

  @Post()
  createLead(@Body() lead: CreateLeadDto): Lead {
    return this.leadsService.create(lead);
  }

  @Put(':id')
  updateLead(@Param('id') id: string, @Body() lead: UpdateLeadDto): Lead {
    return this.leadsService.update(id, lead);
  }

  @Delete(':id')
  deleteLead(@Param('id') id: string) {
    return this.leadsService.delete(id);
  }
}
