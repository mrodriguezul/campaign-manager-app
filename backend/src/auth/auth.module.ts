import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service.js';
import { AgentsModule } from '../agents/agents.module.js';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy.js';
import { AuthController } from './controllers/auth.controller.js';

@Module({
  imports: [AgentsModule, PassportModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
