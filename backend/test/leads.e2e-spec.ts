import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import request from 'supertest';
import type { INestApplication } from '@nestjs/common';
import { E2eTestHelper } from './test-helper.js';
import { Agent } from '../src/agents/entities/agent.entity.js';

describe('LeadsController (e2e)', () => {
  let helper: E2eTestHelper;
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;

  const agentCredentials = {
    name: 'E2E Agent',
    email: 'e2e-agent@example.com',
    password: 'password123',
  };

  const validLead = {
    name: 'E2E Lead',
    phone: '+14155552671',
    context: 'Initial sales call',
  };

  beforeAll(async () => {
    helper = new E2eTestHelper();
    await helper.initializeApp({
      generateResponse: jest
        .fn<(...args: any[]) => Promise<any>>()
        .mockResolvedValue({
        summary: 'Mock summary',
        status: 'INTERESTED',
        }),
    });
    app = helper.app;
    dataSource = helper.dataSource;

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
  });

  beforeEach(async () => {
    await helper.clearDatabase();

    const agentRepository = dataSource.getRepository(Agent);
    const agent = agentRepository.create(agentCredentials);
    await agentRepository.save(agent);

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

  describe('POST /leads, GET /leads/:id, PUT /leads/:id and GET /leads', () => {
    it('should create, retrieve, update and list a lead', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/leads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(validLead)
        .expect(201);

      expect(createResponse.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: validLead.name,
          phone: validLead.phone,
          context: validLead.context,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );

      const leadId = createResponse.body.id;

      const getResponse = await request(app.getHttpServer())
        .get(`/leads/${leadId}`)
        .expect(200);

      expect(getResponse.body).toEqual(
        expect.objectContaining({
          id: leadId,
          name: validLead.name,
          phone: validLead.phone,
          context: validLead.context,
        }),
      );

      const updatedLead = {
        name: 'Updated E2E Lead',
        context: 'Follow-up call',
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/leads/${leadId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedLead)
        .expect(200);

      expect(updateResponse.body).toEqual(
        expect.objectContaining({
          id: leadId,
          name: updatedLead.name,
          phone: validLead.phone,
          context: updatedLead.context,
        }),
      );

      const listResponse = await request(app.getHttpServer())
        .get('/leads')
        .expect(200);

      expect(listResponse.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: leadId,
            name: updatedLead.name,
            phone: validLead.phone,
            context: updatedLead.context,
          }),
        ]),
      );
      expect(listResponse.body).toHaveLength(1);
    });
  });

  describe('validation and not found responses', () => {
    it('should return 400 for an invalid lead payload', async () => {
      await request(app.getHttpServer())
        .post('/leads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it('should return 404 for an unknown lead id', async () => {
      await request(app.getHttpServer()).get('/leads/999999').expect(404);
    });
  });

  describe('Call Logs Flow', () => {
    it('should create a call log and return it through the lead relationship endpoint', async () => {
      const createLeadResponse = await request(app.getHttpServer())
        .post('/leads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(validLead)
        .expect(201);

      const leadId = createLeadResponse.body.id;
      expect(leadId).toEqual(expect.any(Number));

      const callLogPayload = {
        status: 'completed',
        notes: 'The client requests a commercial proposal.',
      };

      const createCallLogResponse = await request(app.getHttpServer())
        .post(`/leads/${leadId}/call-logs`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(callLogPayload)
        .expect(201);

      expect(createCallLogResponse.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          notes: callLogPayload.notes,
          status: 'INTERESTED',
          summary: 'Mock summary',
          createdAt: expect.any(String),
        }),
      );

      const callLogsResponse = await request(app.getHttpServer())
        .get(`/leads/${leadId}/call-logs`)
        .expect(200);

      expect(callLogsResponse.body).toEqual([
        expect.objectContaining({
          id: createCallLogResponse.body.id,
          notes: callLogPayload.notes,
          status: 'INTERESTED',
          summary: 'Mock summary',
        }),
      ]);
    });
  });
});
