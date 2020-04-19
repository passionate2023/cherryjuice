import { Injectable } from '@nestjs/common';
import { DocumentSqliteRepository } from './repositories/document.sqlite.repository';
import { Document } from './entities/document.entity';
import { NodeService } from '../node/node.service';
import { ImageService } from '../image/image.service';
import { DocumentRepository } from './repositories/document.repository';
import { IDocumentService } from './interfaces/document.service';
import { InjectRepository } from '@nestjs/typeorm';
import fs from 'fs';

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

  async openUploadedFile(filePath: string): Promise<void> {
    await this.documentSqliteRepository.openUploadedFile(filePath);
  }

  async getDocumentsMeta(): Promise<Document[]> {
    return this.documentSqliteRepository.getDocumentsMeta();
  }

  async getDocumentMetaById(file_id: string): Promise<Document> {
    return this.documentSqliteRepository.getDocumentMetaById(file_id);
  }

  async saveDocument({
    fileName,
    filePath,
  }: {
    fileName: string;
    filePath: string;
  }): Promise<void> {
    const { size } = fs.statSync(filePath);
    await this.openUploadedFile(filePath);
    const document = new Document();
    document.name = fileName;
    document.size = size;
    await document.save();
    const { nodesWithImages } = await this.nodeSqliteService.saveNodes(
      document,
    );
    await this.imageSqliteService.saveImages(nodesWithImages);
  }
}
