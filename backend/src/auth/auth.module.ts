import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service.js';
import { AgentsModule } from '../agents/agents.module.js';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy.js';
import { AuthController } from './controllers/auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from '../env.model.js';
import { JwtStrategy } from './strategy/jwt.strategy.js';

@Module({
  imports: [AgentsModule, PassportModule, JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService<Env>) => ({
      secret: configService.get('JWT_SECRET', {infer:true}),
      signOptions: { expiresIn: '10m' }
    }),    
  })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
