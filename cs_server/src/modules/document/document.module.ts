import { Module } from '@nestjs/common';
import { NodeContentModule } from './modules/node-content/node-content.module';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import { DocumentRepository } from './document.repository';

@Module({
  imports: [NodeContentModule],
  providers: [DocumentResolver, DocumentService, DocumentRepository],
  exports: [DocumentRepository],
})
export class DocumentModule {}
