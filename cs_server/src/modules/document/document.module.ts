import { Module } from '@nestjs/common';
import { NodeModule } from '../node/node.module';
import { DocumentService } from './document.service';
import { DocumentSqliteRepository } from './repositories/document.sqlite.repository';
import { ImageModule } from '../image/image.module';
import { DocumentRepository } from './repositories/document.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentMutationsResolver } from './document.mutations.resolver';
import { DocumentQueriesResolver } from './document.queries.resolver';
import { DocumentSubscriptionsResolver } from './document.subscriptions.resolver';
import { ImportsService } from './imports.service';

@Module({
  imports: [
    NodeModule,
    ImageModule,
    TypeOrmModule.forFeature([DocumentRepository]),
  ],
  providers: [
    DocumentQueriesResolver,
    DocumentMutationsResolver,
    DocumentSubscriptionsResolver,
    ImportsService,
    DocumentService,
    DocumentSqliteRepository,
  ],
  exports: [DocumentSqliteRepository],
})
export class DocumentModule {}
