import { Injectable } from '@nestjs/common';
import { DocumentSqliteRepository } from './repositories/document.sqlite.repository';
import { Document } from './entities/document.entity';
import { NodeService } from '../node/node.service';
import { ImageService } from '../image/image.service';
import { DocumentRepository } from './repositories/document.repository';
import { IDocumentService } from './interfaces/document.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { debug } from '../shared';
import { DeleteResult } from 'typeorm';

@Injectable()
export class DocumentService implements IDocumentService {
  constructor(
    private documentSqliteRepository: DocumentSqliteRepository,
    @InjectRepository(DocumentRepository)
    private documentRepository: DocumentRepository,
    private nodeService: NodeService,
    private imageService: ImageService,
  ) {}

  async openLocalSqliteFile(file_id: string): Promise<void> {
    await this.documentSqliteRepository.openLocalSqliteFile(file_id);
  }

  async openUploadedFile(filePath: string): Promise<void> {
    await this.documentSqliteRepository.openUploadedFile(filePath);
  }

  async getDocumentsMeta(user: User): Promise<Document[]> {
    if (debug.loadSqliteDocuments)
      return this.documentSqliteRepository.getDocumentsMeta();
    return this.documentRepository.getDocumentsMeta(user);
  }

  async getDocumentMetaById(user: User, file_id: string): Promise<Document> {
    if (debug.loadSqliteDocuments)
      return this.documentSqliteRepository.getDocumentMetaById(user, file_id);
    return this.documentRepository.getDocumentMetaById(user, file_id);
  }

  async saveDocument({
    fileName,
    filePath,
    id,
    user,
  }: {
    fileName: string;
    filePath: string;
    id: string;
    user: User;
  }): Promise<void> {
    await this.openUploadedFile(filePath);
    const document = await this.documentRepository.createDocument({
      fileName,
      filePath,
      user,
      id,
    });
    const { nodesWithImages } = await this.nodeService.saveNodes(document);
    await this.imageService.saveImages(nodesWithImages);
  }

  async deleteDocuments(IDs: string[], user: User): Promise<DeleteResult> {
    return await this.documentRepository.deleteDocuments(IDs, user);
  }
}
