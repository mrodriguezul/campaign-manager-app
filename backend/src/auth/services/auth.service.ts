import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AgentsService } from '../../agents/services/agents.service.js';

@Injectable()
export class AuthService {
    constructor(private agentService: AgentsService){}

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
}
