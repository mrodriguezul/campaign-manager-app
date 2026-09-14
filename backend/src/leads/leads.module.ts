import { Module } from '@nestjs/common';
import { LeadsController } from './controllers/leads.controller.js';
import { LeadsService } from './services/leads.service.js';
import { CallLogService } from './services/call-log.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity.js';
import { CallLog } from './entities/call-log.entity.js';
import { AgentsModule } from '../agents/agents.module.js';
import { AiModule } from '../ai/ai.module.js';

@Module({
    imports:[TypeOrmModule.forFeature([Lead, CallLog]), AgentsModule, AiModule],
    controllers: [LeadsController],
    providers: [LeadsService, CallLogService],
    exports: [LeadsService]
})
export class LeadsModule {}
