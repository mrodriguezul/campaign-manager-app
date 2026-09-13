import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service.js';
import { Agent } from '../../agents/entities/agent.entity.js';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req: ExpressRequest) {
        const user = req.user as Agent;
        return{
            user,
            access_token: this.authService.generateToken(user)
        }
    }
}
