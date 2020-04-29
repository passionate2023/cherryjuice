import { Injectable } from '@nestjs/common';
import { DocumentSqliteRepository } from './repositories/document.sqlite.repository';
import { Document } from './entities/document.entity';
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
  ) {}
  async onModuleInit(): Promise<void> {
    await this.documentRepository.markUnfinishedImportsAsFailed();
  }
  async openLocalSqliteFile(file_id: string): Promise<void> {
    await this.documentSqliteRepository.openLocalSqliteFile(file_id);
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

  async createDocument({
    fileName,
    size,
    id,
    user,
  }: {
    fileName: string;
    size: number;
    id: string;
    user: User;
  }): Promise<Document> {
    return await this.documentRepository.createDocument({
      fileName,
      size,
      user,
      id,
    });
  }
  async deleteDocuments(IDs: string[], user: User): Promise<DeleteResult> {
    return await this.documentRepository.deleteDocuments(IDs, user);
  }
}
