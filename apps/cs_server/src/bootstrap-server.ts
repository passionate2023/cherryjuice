import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

export async function bootstrapServer() {
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
