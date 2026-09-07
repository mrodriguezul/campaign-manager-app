import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';

import { ConfigModule } from '@nestjs/config';
import { LeadsModule } from './leads/leads.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    ConfigModule.forRoot({
      isGlobal : true,
    }),
    LeadsModule
  ]  
})
export class AppModule {}
