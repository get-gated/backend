import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { registerMiddleware } from '../src/main';

export async function appInit(): Promise<INestApplication> {
  const randomPort = (Math.floor(Math.random() * 1000) + 9000).toString();
  process.env.PORT = randomPort;
  process.env.APP_PORT = randomPort;
  process.env.EVENT_BUS_SUBSCRIPTION_PREFIX = randomPort;

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  registerMiddleware(app);
  await app.init();

  return app;
}

export async function appClose(app: INestApplication) {
  await app.close();
}
