import { Module } from '@nestjs/common';
import { NodeModule } from '../node/node.module';
import { DocumentService } from './document.service';
import { ImageModule } from '../image/image.module';
import { DocumentRepository } from './repositories/document.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentMutationsResolver } from './document.mutations.resolver';
import { DocumentQueriesResolver } from './document.queries.resolver';
import { DocumentSubscriptionsResolver } from './document.subscriptions.resolver';
import { ImportsModule } from '../imports/imports.module';
import { ExportsModule } from '../exports/exports.module';
import { DocumentSubscriptionsService } from './document.subscriptions.service';

@Module({
  imports: [
    NodeModule,
    ImageModule,
    TypeOrmModule.forFeature([DocumentRepository]),
    ImportsModule,
    ExportsModule,
  ],
  providers: [
    DocumentQueriesResolver,
    DocumentMutationsResolver,
    DocumentSubscriptionsResolver,
    DocumentService,
    DocumentSubscriptionsService,
  ],
  exports: [DocumentService, DocumentSubscriptionsService],
})
export class DocumentModule {}
