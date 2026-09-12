import { Module } from '@nestjs/common';
import { AgentsService } from './services/agents.service.js';
import { AgentsController } from './controllers/agents.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity.js';

@Module({
  imports:[TypeOrmModule.forFeature([Agent])],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService]
})
export class AgentsModule {}
