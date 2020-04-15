import { Injectable, Logger } from '@nestjs/common';
import { DocumentMeta } from './modules/document-meta/document-meta.entity';
import { organizeData } from './helpers';
import { DocumentRepository } from './document.repository';
import { NodeMeta } from './modules/node-meta/node-meta.entity';

@Injectable()
export class DocumentService {
  logger = new Logger('DocumentService');
  constructor(private documentRepository: DocumentRepository) {}

  async open(file_id: string): Promise<void> {
    await this.documentRepository.open(file_id);
  }

  getDocumentsMeta(): DocumentMeta[] {
    return this.documentRepository.getDocumentsMeta();
  }
  getDocumentMetaById(file_id: string): DocumentMeta {
    return this.documentRepository.getDocumentMetaById(file_id);
  }

  async getNodeMeta(): Promise<NodeMeta[]> {
    const nodes = await this.documentRepository.getNodesMeta();
    const { nodes: organizedNodes } = await organizeData(nodes);
    return Array.from(organizedNodes.values());
  }
}
