import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller.js';
import { LeadsService } from './leads.service.js';

@Module({
    imports:[],
    controllers: [LeadsController],
    providers: [LeadsService],
    exports: [LeadsService]
})
export class LeadsModule {}
