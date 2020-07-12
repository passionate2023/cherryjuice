import { Injectable, Logger } from '@nestjs/common';
import { Document } from './entities/document.entity';
import { DocumentRepository } from './repositories/document.repository';
import { IDocumentService } from './interfaces/document.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { DeleteResult } from 'typeorm';
import { DocumentDTO } from '../imports/imports.service';
import { EditDocumentDto } from './input-types/edit-document.dto';
import { DocumentSubscriptionsService } from './document.subscriptions.service';

@Injectable()
export class DocumentService implements IDocumentService {
  logger = new Logger('document-service');
  constructor(
    @InjectRepository(DocumentRepository)
    private documentRepository: DocumentRepository,
    private subscriptionsService: DocumentSubscriptionsService,
  ) {}
  async onModuleInit(): Promise<void> {
    await this.documentRepository
      .markUnfinishedImportsAsFailed()
      .catch(e =>
        this.logger.error(
          e.message,
          e.trace,
          'mark-unfinished-imports-as-failed',
        ),
      );
  }

  async getDocumentsMeta(user: User): Promise<Document[]> {
    return this.documentRepository.getDocumentsMeta(user);
  }

  async getDocumentMetaById(user: User, file_id: string): Promise<Document> {
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
        const document = new Document(user, '', 0);
        document.id = id;
        document.userId = user.id;
        this.subscriptionsService.import.deleted(document);
      });
    return deleteResult;
  }
  async findDocumentByHash(hash: string, user: User): Promise<Document> {
    return await this.documentRepository.findOne({
      where: { userId: user.id, hash },
    });
  }

  async editDocument(args: EditDocumentDto): Promise<string> {
    return await this.documentRepository.editDocument(args);
  }

  async updateNodesHash({
    user,
    documentId,
    node_id,
    hash,
  }: {
    user: User;
    documentId: string;
    node_id: number;
    hash: string;
  }): Promise<void> {
    const document = await this.getDocumentMetaById(user, documentId);
    document.nodes[node_id] = { hash };
    await document.save();
  }
  async deleteNodesHash({
    user,
    documentId,
    node_id,
  }: {
    node_id: number;
    user: User;
    documentId: string;
  }): Promise<void> {
    const document = await this.getDocumentMetaById(user, documentId);
    delete document.nodes[node_id].hash;
    if (Object.keys(document.nodes[node_id]).length === 0)
      delete document.nodes[node_id];
    await document.save();
  }

  async getSize(args: { documentId: string; user: User }): Promise<number> {
    return await this.documentRepository.getSize(args);
  }
}
