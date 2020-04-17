import { Injectable } from '@nestjs/common';
import { DocumentSqliteRepository } from './repositories/document.sqlite.repository';
import { Document } from './entities/document.entity';
import { NodeService } from '../node/node.service';
import { ImageService } from '../image/image.service';
import { copyProperties } from './helpers';
import { DocumentRepository } from './repositories/document.repository';
import { IDocumentService } from './interfaces/document.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DocumentService implements IDocumentService {
  constructor(
    private documentSqliteRepository: DocumentSqliteRepository,
    @InjectRepository(DocumentRepository)
    private documentRepository: DocumentRepository,
    private nodeSqliteService: NodeService,
    private imageSqliteService: ImageService,
  ) {}

  async open(file_id: string): Promise<void> {
    await this.documentSqliteRepository.open(file_id);
  }

  async getDocumentsMeta(): Promise<Document[]> {
    return this.documentSqliteRepository.getDocumentsMeta();
  }

  async getDocumentMetaById(file_id: string): Promise<Document> {
    return this.documentSqliteRepository.getDocumentMetaById(file_id);
  }

  async saveDocument(file_id: string): Promise<void> {
    await this.open(file_id);
    const documentToBeSaved = await this.getDocumentMetaById(file_id);
    const document = new Document();
    copyProperties(documentToBeSaved, document, { id: true });
    await document.save();
    const { nodesWithImages } = await this.nodeSqliteService.saveNodes(
      document,
    );
    await this.imageSqliteService.saveImages(nodesWithImages);
  }
}
