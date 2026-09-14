import { Module } from '@nestjs/common';
import { GeminiService } from './services/gemini.service.js';
import { PromptService } from './services/prompt.service.js';

@Module({
  providers: [GeminiService, PromptService],
  exports: [GeminiService, PromptService]
})
export class AiModule {}
