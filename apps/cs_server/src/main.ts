require('dotenv').config({ path: '../../.env' });
process.env.TZ = 'UTC';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

const port = process.env.NODE_PORT || '3000';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

// eslint-disable-next-line no-console
bootstrap().catch(console.error);
