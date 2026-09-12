import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAgentDto } from '../dto/create-agent.dto.js';
import { UpdateAgentDto } from '../dto/update-agent.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from '../entities/agent.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private agentsRepository: Repository<Agent>,
  ) {}

  async findAll() {
    const agents = await this.agentsRepository.find();
    return agents;
  }

  async findById(id: number) {
    const agent = await this.getAgent(id);
    return agent;
  }

  async create(agent: CreateAgentDto) {
    try {
      const newAgent = await this.agentsRepository.create(agent);
      const savedAgent = await this.agentsRepository.save(newAgent);
      return savedAgent;
    } catch {
      throw new BadRequestException('Error creating agent ...');
    }
  }

  async update(id: number, agent: UpdateAgentDto) {
    const agentFound = await this.getAgent(id);

    if (
      (agent.name != undefined && agent.name.trim().length === 0) ||
      (agent.email != undefined && agent.email.trim().length === 0)
    ) {
      throw new UnprocessableEntityException(
        'Name and email cannot be empty',
      );
    }

    const updatedAgent = this.agentsRepository.merge(agentFound, agent);
    return this.agentsRepository.save(updatedAgent);
  }

  async delete(id: number) {
    const agent = await this.getAgent(id);
    await this.agentsRepository.delete(agent.id);

    return {
      message: 'Agent deleted successfully',
    };
  }

  private async getAgent(id: number) {
    const agent = await this.agentsRepository.findOneBy({ id });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    return agent;
  }
}
