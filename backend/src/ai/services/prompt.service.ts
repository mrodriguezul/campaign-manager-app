import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Injectable()
export class PromptService {
    private readonly logger = new Logger(PromptService.name);

    private promptCache: Map<string, string> = new Map();

    getPrompt(promptName: string, variables: Record<string, string>): String{
        let template = this.promptCache.get(promptName);

        if (!template) {
            try {
                const promptPath = path.join(__dirname, '..', 'prompts', `${promptName}.md`);
                
                template = fs.readFileSync(promptPath, 'utf8');
                this.promptCache.set(promptName, template);
                this.logger.log(`Loaded prompt template: ${promptName}.md`);
            } catch (error) {
                this.logger.error(`Failed to load prompt file: ${promptName}.md`, error);
                throw new InternalServerErrorException('Error loading AI configuration.');
            }
        }
        
        let finalPrompt = template;
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            finalPrompt = finalPrompt.replace(regex, value);
        }
        return finalPrompt;
    }

}
