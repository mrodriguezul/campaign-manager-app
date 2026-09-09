import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller.js';
import { LeadsService } from './leads.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity.js';
import { CallLog } from './entities/call-log.entity.js';

@Module({
    imports:[TypeOrmModule.forFeature([Lead, CallLog])],
    controllers: [LeadsController],
    providers: [LeadsService],
    exports: [LeadsService]
})
export class LeadsModule {}
