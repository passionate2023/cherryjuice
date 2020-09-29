import { forwardRef, Module } from '@nestjs/common';
import { NodeModule } from '../node/node.module';
import { DocumentService } from './document.service';
import { ImageModule } from '../image/image.module';
import { DocumentRepository } from './repositories/document.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentMutationsResolver } from './document.mutations.resolver';
import { DocumentQueriesResolver } from './document.queries.resolver';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { ImportsModule } from '../imports/imports.module';
import { ExportsModule } from '../exports/exports.module';
import { SubscriptionsService } from './subscriptions.service';
import { DocumentGuestRepository } from './repositories/document-guest.repository';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    forwardRef(() => NodeModule),
    ImageModule,
    TypeOrmModule.forFeature([DocumentRepository, DocumentGuestRepository]),
    ImportsModule,
    ExportsModule,
    SearchModule,
  ],
  providers: [
    DocumentQueriesResolver,
    DocumentMutationsResolver,
    SubscriptionsResolver,
    DocumentService,
    SubscriptionsService,
  ],
  exports: [DocumentService, SubscriptionsService],
})
export class DocumentModule {}
