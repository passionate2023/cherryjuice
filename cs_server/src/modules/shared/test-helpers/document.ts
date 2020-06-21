require('dotenv').config();
import { NodeModule } from '../../node/node.module';
import { Test, TestingModule } from '@nestjs/testing';
import { ImageModule } from '../../image/image.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../../config/typeorm.config';
import { ImportsModule } from '../../imports/imports.module';
import { DocumentRepository } from '../../document/repositories/document.repository';
import { DocumentQueriesResolver } from '../../document/document.queries.resolver';
import { DocumentMutationsResolver } from '../../document/document.mutations.resolver';
import { DocumentSubscriptionsResolver } from '../../document/document.subscriptions.resolver';
import { DocumentService } from '../../document/document.service';
import { DocumentSqliteRepository } from '../../document/repositories/document.sqlite.repository';

export type DocumentTH = {
  service: DocumentService;
  module: TestingModule;
};
const createTestHelpers = async (): Promise<DocumentTH> => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      NodeModule,
      ImageModule,
      TypeOrmModule.forFeature([DocumentRepository]),
      TypeOrmModule.forRoot(typeOrmConfig),
      ImportsModule,
    ],
    providers: [
      DocumentQueriesResolver,
      DocumentMutationsResolver,
      DocumentSubscriptionsResolver,
      DocumentService,
      DocumentSqliteRepository,
    ],
    exports: [DocumentSqliteRepository, DocumentService],
  }).compile();
  const service: DocumentService = module.get<DocumentService>(DocumentService);
  return { service, module };
};

export { createTestHelpers as createDocumentTestHelpers };
