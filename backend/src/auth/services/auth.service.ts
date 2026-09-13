import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AgentsService } from '../../agents/services/agents.service.js';
import { JwtService } from '@nestjs/jwt';
import { Agent } from '../../agents/entities/agent.entity.js';
import { Payload } from '../model/payload.model.js';

@Injectable()
export class AuthService {
    constructor(
        private agentService: AgentsService,
        private jwtService: JwtService){}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.agentService.findOneByEmail(email);
        if(!user){
            throw new UnauthorizedException('Unauthorized')
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if(isMatch){
            return user;
        }
        return null;
    }

    generateToken(user: Agent){
        const payload : Payload = { sub: user.id };
        return this.jwtService.sign(payload);
    }
}
