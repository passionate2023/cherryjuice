import { Injectable } from '@nestjs/common';
import { DocumentSqliteRepository } from './repositories/document.sqlite.repository';
import { Document } from './entities/document.entity';
import { DocumentRepository } from './repositories/document.repository';
import { IDocumentService } from './interfaces/document.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { debug } from '../shared';
import { DeleteResult } from 'typeorm';
import { DocumentDTO } from '../imports/imports.service';
import { importThreshold } from '../imports/helpers/thresholds';

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

  async createDocument(documentDTO: DocumentDTO): Promise<Document> {
    return await this.documentRepository.createDocument(documentDTO);
  }
  async deleteDocuments(
    IDs: string[],
    user: User,
    { notifySubscribers } = { notifySubscribers: true },
  ): Promise<DeleteResult> {
    const deleteResult = await this.documentRepository.deleteDocuments(
      IDs,
      user,
    );
    if (notifySubscribers)
      IDs.forEach(id => {
        const document = new Document(user,"",0)
        document.id = id
        importThreshold.deleted(document);
      });
    return deleteResult;
  }
  async findDocumentByHash(hash: string, user: User): Promise<Document> {
    return await this.documentRepository.findOne({
      where: { userId: user.id, hash },
    });
  }
}
