import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';

import { CreateLeadDto } from '../dto/create-lead.dto.js';
import { UpdateLeadDto } from '../dto/update-lead.dto.js';
import { CreateCallLogDto } from '../dto/create-call-log.dto.js';
import { LeadsService } from '../services/leads.service.js';
import { CallLogService } from '../services/call-log.service.js';
import { AuthGuard } from '@nestjs/passport';
import { Payload } from '../../auth/model/payload.model.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('leads')
export class LeadsController {
  constructor(
    private leadsService: LeadsService,
    private callLogService: CallLogService,
  ) {}

  @ApiOperation({summary: 'Get all leads'})
  @Get()
  getLeads() {
    return this.leadsService.findAll();
  }

  @ApiOperation({summary: 'Get lead by ID'})
  @Get(':id')
  getLeadsById(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.findById(id);
  }

  @ApiOperation({summary: 'Get all call logs by Lead ID'})
  @Get(':id/call-logs')
  getCallLogsByLeadId(@Param('id', ParseIntPipe) id: number) {
    return this.callLogService.getCallLogsByLeadId(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({summary: 'Create a new call log for a lead'})
  @Post(':id/call-logs')
  createCallLog(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCallLogDto: CreateCallLogDto,
    @Request() req: ExpressRequest
  ) {
    const user = req.user as any;
    return this.callLogService.create(id, createCallLogDto, user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({summary: 'Create a new Lead'})
  @Post()
  createLead(@Body() lead: CreateLeadDto) {
    return this.leadsService.create(lead);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({summary: 'Update Lead by ID'})
  @Put(':id')
  updateLead(@Param('id', ParseIntPipe) id: number, @Body() lead: UpdateLeadDto) {
    return this.leadsService.update(id, lead);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({summary: 'Remove lead by ID'})
  @Delete(':id')
  deleteLead(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.delete(id);
  }
}
