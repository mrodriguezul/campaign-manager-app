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
} from '@nestjs/common';
import { CreateAgentDto } from '../dto/create-agent.dto.js';
import { UpdateAgentDto } from '../dto/update-agent.dto.js';
import { AgentsService } from '../services/agents.service.js';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Agent } from '../entities/agent.entity.js';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('agents')
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  @ApiOperation({summary: 'Get all Agents'})
  @ApiResponse({status: 200, description: 'The list of Agents', type: Agent})
  @Get()
  getAgents() {
    return this.agentsService.findAll();
  }

  @ApiOperation({summary: 'Get Agent by ID'})
  @Get(':id')
  getAgentById(@Param('id', ParseIntPipe) id: number) {
    return this.agentsService.findById(id);
  }

  @ApiOperation({summary: 'Create a new Agent'})
  @Post()
  createAgent(@Body() agent: CreateAgentDto) {
    return this.agentsService.create(agent);
  }

  @ApiOperation({summary: 'Update Agent by ID'})
  @Put(':id')
  updateAgent(@Param('id', ParseIntPipe) id: number, @Body() agent: UpdateAgentDto) {
    return this.agentsService.update(id, agent);
  }

  @ApiOperation({summary: 'Remove Agent by ID'})
  @Delete(':id')
  deleteAgent(@Param('id', ParseIntPipe) id: number) {
    return this.agentsService.delete(id);
  }
}
