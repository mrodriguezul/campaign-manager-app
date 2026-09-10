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
import { CreateAgentDto } from '../dto/create-agent.dto.js';
import { UpdateAgentDto } from '../dto/update-agent.dto.js';
import { AgentsService } from '../services/agents.service.js';

@Controller('agents')
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  @Get()
  getAgents() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  getAgentById(@Param('id', ParseIntPipe) id: number) {
    return this.agentsService.findById(id);
  }

  @Post()
  createAgent(@Body() agent: CreateAgentDto) {
    return this.agentsService.create(agent);
  }

  @Put(':id')
  updateAgent(@Param('id', ParseIntPipe) id: number, @Body() agent: UpdateAgentDto) {
    return this.agentsService.update(id, agent);
  }

  @Delete(':id')
  deleteAgent(@Param('id', ParseIntPipe) id: number) {
    return this.agentsService.delete(id);
  }
}
