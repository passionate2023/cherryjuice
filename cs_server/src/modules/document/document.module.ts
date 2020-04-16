import { Module } from '@nestjs/common';
import { NodeModule } from '../node/node.module';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import { DocumentSqliteRepository } from './repositories/document.sqlite.repository';

@Module({
  imports: [NodeModule],
  providers: [DocumentResolver, DocumentService, DocumentSqliteRepository],
  exports: [DocumentSqliteRepository],
})
export class DocumentModule {}
