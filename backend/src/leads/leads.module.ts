import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller.js';
import { LeadsService } from './leads.service.js';
import { CallLogService } from './call-log.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity.js';
import { CallLog } from './entities/call-log.entity.js';
import { AgentsModule } from '../agents/agents.module.js';

@Module({
    imports:[TypeOrmModule.forFeature([Lead, CallLog]), AgentsModule],
    controllers: [LeadsController],
    providers: [LeadsService, CallLogService],
    exports: [LeadsService]
})
export class LeadsModule {}
