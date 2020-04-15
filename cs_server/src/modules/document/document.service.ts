import { Injectable } from '@nestjs/common';
import { DocumentRepository } from './document.repository';
import { Document } from './document.entity';

@Injectable()
export class DocumentService {
  constructor(private documentRepository: DocumentRepository) {}

  async open(file_id: string): Promise<void> {
    await this.documentRepository.open(file_id);
  }

  getDocumentsMeta(): Document[] {
    return this.documentRepository.getDocumentsMeta();
  }
  getDocumentMetaById(file_id: string): Document {
    return this.documentRepository.getDocumentMetaById(file_id);
  }
}
