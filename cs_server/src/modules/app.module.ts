import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod, ValidationPipe,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DocumentModule } from './document/document.module';
import {
  addSTSHeader,
  redirectToHTTPS,
  sendCompressedJavascript,
} from '../middleware';
import path from 'path';
import express from 'express';
import { NodeModule } from './node/node.module';
import { ImageModule } from './image/image.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    NodeModule,
    ImageModule,
    GraphQLModule.forRoot({
      include: [NodeModule, DocumentModule, ImageModule, UserModule],
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
  ],
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
    if (process.env.NODE_ENV === 'production') {
      consumer
        .apply(sendCompressedJavascript)
        .exclude('/graphql')
        .forRoutes({ path: '*.js', method: RequestMethod.GET });
      consumer.apply(addSTSHeader, redirectToHTTPS).forRoutes('*');
    }
    const staticAssetsRootFolder =
      process.env.NODE_ENV === 'production'
        ? path.join(__dirname, '../../client')
        : path.join(process.cwd(), '../cs_client/dist');
    consumer
      .apply(express.static(staticAssetsRootFolder))
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
