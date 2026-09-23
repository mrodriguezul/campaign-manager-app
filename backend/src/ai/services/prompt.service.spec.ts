import { beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { PromptService } from './prompt.service.js';

describe('PromptService', () => {
  let service: PromptService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromptService],
    }).compile();

    service = module.get<PromptService>(PromptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPrompt', () => {
    it('should load a prompt and replace its variables', () => {
      const prompt = service.getPrompt('call-log', {
        rawNotes: 'Customer requested a follow-up call.',
      });

      expect(prompt).toContain('Customer requested a follow-up call.');
      expect(prompt).not.toContain('{{rawNotes}}');
    });

    it('should return the cached prompt on subsequent calls', () => {
      const variables = { rawNotes: 'First call notes.' };
      const firstPrompt = service.getPrompt('call-log', variables);
      const secondPrompt = service.getPrompt('call-log', {
        rawNotes: 'Second call notes.',
      });

      expect(firstPrompt).toContain('First call notes.');
      expect(secondPrompt).toContain('Second call notes.');
    });

    it('should throw InternalServerErrorException for an unknown prompt', () => {
      expect(() => service.getPrompt('missing-prompt', {})).toThrow(
        InternalServerErrorException,
      );
    });
  });
});
