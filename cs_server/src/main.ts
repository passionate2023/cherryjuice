import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

const port = process.env.PORT || '3000';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);
}
// eslint-disable-next-line no-console
bootstrap().catch(console.error);
