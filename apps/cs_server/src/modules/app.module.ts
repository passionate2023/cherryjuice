import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DocumentModule } from './document/document.module';
import { NodeModule } from './node/node.module';
import { ImageModule } from './image/image.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as typeOrmConfig from '../config/typeorm.config';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { APP_PIPE } from '@nestjs/core';
import { SearchModule } from './search/search.module';
import { ValidationPipe } from './user/pipes/validation.pipe';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  addSTSHeader,
  redirectToHTTPS,
  sendCompressedJavascript,
} from '../middleware';

@Module({
  imports: [
    process.env.NODE_SERVE_STATIC === 'true' &&
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '../../../../cs_client/dist'),
      }),
    GraphQLModule.forRoot({
      include: [
        NodeModule,
        DocumentModule,
        ImageModule,
        UserModule,
        SearchModule,
      ],
      autoSchemaFile: true,
      context: ({ req, connection }) => {
        if (connection) {
          return { req: { headers: connection.context } };
        }
        // queries and mutations
        return { req };
      },
      installSubscriptionHandlers: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    DocumentModule,
  ].filter(Boolean),
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    if (process.env.NODE_SERVE_STATIC === 'true')
      consumer.apply(sendCompressedJavascript).forRoutes(
        ...['js', 'css', 'svg'].map(extension => ({
          path: '*.' + extension,
          method: RequestMethod.GET,
        })),
      );

    if (process.env.NODE_REDIRECT_TO_HTTPS === 'true')
      consumer.apply(redirectToHTTPS).forRoutes('*');

    if (process.env.NODE_STS === 'true')
      consumer.apply(addSTSHeader).forRoutes('*');
  }
}
