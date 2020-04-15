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
import { NodeModule } from './document/modules/node/node.module';
import { ImageModule } from './document/modules/node/modules/image/image.module';

@Module({
  imports: [
    DocumentModule,
    NodeModule,
    ImageModule,
    GraphQLModule.forRoot({
      include: [NodeModule, DocumentModule, ImageModule],
      autoSchemaFile: true,
    }),
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
    const staticAssetsRootFolder = path.join(
      __dirname,
      process.env.NODE_ENV === 'production'
        ? '../../client'
        : '../../cs_client/dist',
    );
    consumer
      .apply(
        express.static(staticAssetsRootFolder),
        ignoreClientSideRouting({ staticAssetsRootFolder }),
      )
      .exclude('/graphql')
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
