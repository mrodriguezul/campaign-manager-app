import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module.js';
import { GeminiService } from '../src/ai/services/gemini.service.js';

type GeminiServiceOverride = Pick<GeminiService, 'generateResponse'>;
type AppConfigurator = (app: INestApplication) => void;

export class E2eTestHelper {
  public app: INestApplication;
  public dataSource: DataSource;

  async initializeApp(
    geminiService?: GeminiServiceOverride,
    configureApp?: AppConfigurator,
  ): Promise<void> {
    const moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    });

    if (geminiService) {
      moduleBuilder.overrideProvider(GeminiService).useValue(geminiService);
    }

    const moduleFixture: TestingModule = await moduleBuilder.compile();

    this.app = moduleFixture.createNestApplication();
    configureApp?.(this.app);
    await this.app.init();
    this.dataSource = this.app.get(DataSource);
  }

  async clearDatabase(): Promise<void> {
    const entities = this.dataSource.entityMetadatas;
    for (const entity of entities) {
      await this.dataSource.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
  }

  async closeApp(): Promise<void> {
    if (this.app) {
      await this.app.close();
    }
  }
}