import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module.js';

export class E2eTestHelper {
  public app: INestApplication;
  public dataSource: DataSource;

  async initializeApp(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
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