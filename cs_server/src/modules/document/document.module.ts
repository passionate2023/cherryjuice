import { Module } from '@nestjs/common';
import { NodeModule } from './modules/node/node.module';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import { DocumentRepository } from './document.repository';

@Module({
  imports: [NodeModule],
  providers: [DocumentResolver, DocumentService, DocumentRepository],
  exports: [DocumentRepository],
})
export class DocumentModule {}
