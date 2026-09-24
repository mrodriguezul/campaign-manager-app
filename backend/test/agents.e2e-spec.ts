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

describe('AgentsController (e2e)', () => {
  let helper: E2eTestHelper;
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;

  const agentCredentials = {
    name: 'Agents E2E Agent',
    email: 'agents-e2e-agent@example.com',
    password: 'password123',
  };

  const createAgentPayload = {
    name: 'Created E2E Agent',
    email: 'created-e2e-agent@example.com',
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

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: agentCredentials.email,
        password: agentCredentials.password,
      })
      .expect(201);

    accessToken = loginResponse.body.access_token;
    expect(accessToken).toEqual(expect.any(String));
  });

  afterAll(async () => {
    await helper.closeApp();
  });

  describe('POST /agents', () => {
    it('should create an agent without returning its password', async () => {
      const response = await request(app.getHttpServer())
        .post('/agents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createAgentPayload)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: createAgentPayload.name,
          email: createAgentPayload.email,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
      expect(response.body.password).toBeUndefined();
    });

    it('should reject an agent with a duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/agents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...createAgentPayload,
          email: agentCredentials.email,
        })
        .expect((response) => {
          expect([400, 409]).toContain(response.status);
        });
    });
  });

  describe('GET /agents', () => {
    it('should return the agents list', async () => {
      const response = await request(app.getHttpServer())
        .get('/agents')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: agentCredentials.name,
            email: agentCredentials.email,
          }),
        ]),
      );
      expect(response.body).toHaveLength(1);
      expect(response.body[0].password).toBeUndefined();
    });
  });
});
