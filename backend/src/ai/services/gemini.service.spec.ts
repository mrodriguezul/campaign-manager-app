import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from './gemini.service.js';

describe('GeminiService', () => {
  let service: GeminiService;
  let generateContent: jest.Mock<(...args: any[]) => any>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<GeminiService>(GeminiService);
    generateContent = jest.fn();
    (service as any).model = { generateContent };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw when the Gemini API key is missing', async () => {
      await expect(
        Test.createTestingModule({
          providers: [
            GeminiService,
            {
              provide: ConfigService,
              useValue: {
                get: jest.fn().mockReturnValue(undefined),
              },
            },
          ],
        }).compile(),
      ).rejects.toThrow('AI Api KEy is not set');
    });
  });

  describe('generateResponse', () => {
    it('should generate and parse the Gemini response', async () => {
      const response = { summary: 'Follow up required', status: 'CALL_BACK' };
      generateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify(response),
        },
      });

      await expect(service.generateResponse('Call AI response')).resolves.toEqual(
        response,
      );
      expect(generateContent).toHaveBeenCalledWith('Call AI response');
    });

    it('should propagate errors from Gemini', async () => {
      const error = new Error('Gemini unavailable');
      generateContent.mockRejectedValue(error);

      await expect(service.generateResponse('Call AI response')).rejects.toBe(error);
    });

    it('should reject when Gemini returns invalid JSON', async () => {
      generateContent.mockResolvedValue({
        response: {
          text: () => 'invalid-json',
        },
      });

      await expect(service.generateResponse('Call AI response')).rejects.toThrow(
        SyntaxError,
      );
    });
  });
});
