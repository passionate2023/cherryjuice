import { Injectable } from '@nestjs/common';
import { DocumentSqliteRepository } from './repositories/document.sqlite.repository';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(private documentSqliteRepository: DocumentSqliteRepository) {}

  async open(file_id: string): Promise<void> {
    await this.documentSqliteRepository.open(file_id);
  }

  async getDocumentsMeta(): Promise<Document[]> {
    return this.documentSqliteRepository.getDocumentsMeta();
  }
  async getDocumentMetaById(file_id: string): Promise<Document> {
    return this.documentSqliteRepository.getDocumentMetaById(file_id);
  }
}
