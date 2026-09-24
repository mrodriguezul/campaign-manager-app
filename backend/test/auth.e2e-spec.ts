import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { E2eTestHelper } from './test-helper.js';
import { Agent } from '../src/agents/entities/agent.entity.js';

describe('AuthController (e2e)', () => {
  let helper: E2eTestHelper;
  let app: INestApplication;
  let dataSource: DataSource;

  const agentCredentials = {
    name: 'Auth E2E Agent',
    email: 'auth-e2e-agent@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    helper = new E2eTestHelper();
    await helper.initializeApp(undefined, (testApp) => {
      testApp.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: { enableImplicitConversion: true },
        }),
      );
      testApp.useGlobalInterceptors(
        new ClassSerializerInterceptor(testApp.get(Reflector)),
      );
    });
    app = helper.app;
    dataSource = helper.dataSource;
  });

  beforeEach(async () => {
    await helper.clearDatabase();

    const agentRepository = dataSource.getRepository(Agent);
    await agentRepository.save(agentRepository.create(agentCredentials));
  });

  afterAll(async () => {
    await helper.closeApp();
  });

  describe('POST /auth/login', () => {
    it('should return a JWT for valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: agentCredentials.email,
          password: agentCredentials.password,
        })
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          user: expect.objectContaining({
            id: expect.any(Number),
            email: agentCredentials.email,
            name: agentCredentials.name,
          }),
          access_token: expect.any(String),
        }),
      );
      expect(response.body.user.password).toBeUndefined();
    });

    it('should return 401 for an incorrect password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: agentCredentials.email,
          password: 'wrong-password',
        })
        .expect(401);
    });

    it('should return 401 for a nonexistent user', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'missing-agent@example.com',
          password: 'password123',
        })
        .expect(401);
    });
  });
});
