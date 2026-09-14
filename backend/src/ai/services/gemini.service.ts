import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../env.model.js';

@Injectable()
export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;
    
    constructor(private configService: ConfigService<Env>){
        const apiKey = configService.get('GEMINI_API_KEY', { infer: true });
        if(!apiKey){
            throw new Error('AI Api KEy is not set');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: 'application/json' } });
    }

    async generateResponse(prompt: String){
        const result = await this.model.generateContent(prompt);
        const aiResponse = JSON.parse(result.response.text());
        return aiResponse;
    }
}
