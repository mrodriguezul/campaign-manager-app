import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service.js';
import { Agent } from '../../agents/entities/agent.entity.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto.js';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @UseGuards(AuthGuard('local'))
    @ApiOperation({summary: 'Login Agent'})
    @ApiResponse({status: 200, description: 'User information + token', type: Agent})
    @Post('login')
    async login(@Request() req: ExpressRequest, @Body() body: LoginDto) {
        const user = req.user as Agent;
        return{
            user,
            access_token: this.authService.generateToken(user)
        }
    }
}
