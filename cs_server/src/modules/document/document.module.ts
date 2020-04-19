import { Module } from '@nestjs/common';
import { NodeModule } from '../node/node.module';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import { DocumentSqliteRepository } from './repositories/document.sqlite.repository';
import { ImageModule } from '../image/image.module';
import { DocumentRepository } from './repositories/document.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    NodeModule,
    ImageModule,
    TypeOrmModule.forFeature([DocumentRepository]),
  ],
  providers: [DocumentResolver, DocumentService, DocumentSqliteRepository],
  exports: [DocumentSqliteRepository],
})
export class DocumentModule {}
