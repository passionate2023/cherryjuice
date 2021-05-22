import './env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { migrations } from './migrations';

async function bootstrap() {
  const port = process.env.NODE_PORT;
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

(async () => {
  try {
    await migrations();
    await bootstrap();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
})();
