import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DocumentModule } from './document/document.module';
import {
  addSTSHeader,
  ignoreClientSideRouting,
  redirectToHTTPS,
  sendCompressedJavascript,
} from '../middleware';
import path from 'path';
import express from 'express';
import { NodeModule } from './node/node.module';
import { ImageModule } from './image/image.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DocumentModule,
    NodeModule,
    ImageModule,
    GraphQLModule.forRoot({
      include: [NodeModule, DocumentModule, ImageModule],
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
  ],
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
      .apply(
        express.static(staticAssetsRootFolder),
        ignoreClientSideRouting({ staticAssetsRootFolder }),
      )
      .exclude('/graphql','/auth/')
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
