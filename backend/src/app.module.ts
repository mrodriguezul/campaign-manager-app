import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { LeadsModule } from './leads/leads.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from './env.model.js';
import { AgentsModule } from './agents/agents.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AiModule } from './ai/ai.module.js';


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ...(process.env.NODE_ENV === 'test'
      ? []
      : [
          ObserveModule.forRoot({
            appKey: 'YOUR_APP_KEY',
            appSecret: 'YOUR_APP_SECRET',
            serviceId: 'backend',
          }),
        ]),
    ConfigModule.forRoot({
      isGlobal : true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<Env>) => ({
        type: 'postgres',
        host: configService.get("POSTGRES_HOST", {infer: true}),
        port: configService.get("POSTGRES_PORT", {infer: true}),
        username: configService.get("POSTGRES_USER", {infer: true}),
        password: configService.get("POSTGRES_PASSWORD", {infer: true}),
        database: configService.get("POSTGRES_DB", {infer: true}),
        autoLoadEntities: true,
        synchronize: configService.get("NODE_ENV", { infer: true }) === 'test',
      }),
      inject: [ConfigService], 
    }),
    LeadsModule,
    AgentsModule,
    AuthModule,
    AiModule
  ]  
})
export class AppModule {}
