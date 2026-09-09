import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { LeadsService } from './leads.service.js';

@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Get()
  getLeads() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  getLeadsById(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.findById(id);
  }

  @Post()
  createLead(@Body() lead: CreateLeadDto) {
    return this.leadsService.create(lead);
  }

  @Put(':id')
  updateLead(@Param('id', ParseIntPipe) id: number, @Body() lead: UpdateLeadDto) {
    return this.leadsService.update(id, lead);
  }

  @Delete(':id')
  deleteLead(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.delete(id);
  }
}
