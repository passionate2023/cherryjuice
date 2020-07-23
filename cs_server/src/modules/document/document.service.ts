import { Injectable, Logger } from '@nestjs/common';
import { Document } from './entities/document.entity';
import {
  DocumentRepository,
  EditDocumentDTO,
} from './repositories/document.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { CreateDocumentDTO } from '../imports/imports.service';
import { DocumentSubscriptionsService } from './document.subscriptions.service';
import {
  DocumentOwner,
  OwnershipLevel,
} from './entities/document.owner.entity';
import {
  CreateDocumentOwnershipDTO,
  DocumentOwnerRepository,
} from './repositories/document.owner.repository';
import { EditDocumentIt } from './input-types/edit-document.it';

export type GetDocumentDTO = {
  userId: string;
  documentId: string;
  ownership: OwnershipLevel;
  publicAccess?: boolean;
};

@Injectable()
export class DocumentService {
  logger = new Logger('document-service');
  constructor(
    @InjectRepository(DocumentRepository)
    private documentRepository: DocumentRepository,
    private subscriptionsService: DocumentSubscriptionsService,
    private documentOwnerRepository: DocumentOwnerRepository,
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

  async getDocuments(dto: GetDocumentDTO): Promise<Document[]> {
    return this.documentRepository.getDocuments(dto);
  }

  async getDocumentById(dto: GetDocumentDTO): Promise<Document> {
    return this.documentRepository.getDocumentById(dto);
  }

  async createDocument(dto: CreateDocumentDTO): Promise<Document> {
    const document = await this.documentRepository.createDocument(dto);
    await this.documentOwnerRepository.createOwnership({
      document,
      user: dto.user,
      ownershipLevel: OwnershipLevel.OWNER,
    });
    return document;
  }

  async editDocument(dto: EditDocumentDTO): Promise<Document> {
    if (typeof dto.meta?.owner?.public === 'boolean') {
      await this.documentOwnerRepository.updateOwnership(dto);
      delete dto.meta.owner;
    }
    return await this.documentRepository.editDocument(dto);
  }
  async deleteDocuments(
    IDs: string[],
    user: User,
    { notifySubscribers } = { notifySubscribers: true },
  ): Promise<string[]> {
    const deleteResult = await this.documentRepository.deleteDocuments(
      IDs,
      user,
    );
    if (notifySubscribers)
      IDs.forEach(id => {
        const document = new Document('');
        document.id = id;
        this.subscriptionsService.import.deleted(document, user.id);
      });
    return deleteResult;
  }
  createDocumentOwnership = async (
    args: CreateDocumentOwnershipDTO,
  ): Promise<DocumentOwner> => {
    return this.documentOwnerRepository.createOwnership(args);
  };
  /// ///
  ///
  async findDocumentByHash(hash: string): Promise<Document> {
    return await this.documentRepository.findOne({
      where: { hash },
    });
  }

  async updateNodesHash({
    documentId,
    node_id,
    hash,
    userId,
    ownership,
  }: {
    userId: string;
    documentId: string;
    node_id: number;
    hash: string;
    ownership: OwnershipLevel;
  }): Promise<Document> {
    const document = await this.editDocument({
      getDocumentDTO: {
        documentId: documentId,
        userId,
        ownership,
      },
      meta: ({} as unknown) as EditDocumentIt,
      updater: document => {
        document.nodes[node_id] = { hash };
        return document;
      },
    });
    // document.nodes[node_id] = { hash };
    // await document.save();
    return document;
  }
  async deleteNodesHash({
    documentId,
    node_id,
    userId,
    ownership,
  }: {
    userId: string;
    documentId: string;
    node_id: number;
    ownership: OwnershipLevel;
  }): Promise<void> {
    const document = await this.getDocumentById({
      documentId: documentId,
      userId,
      ownership,
    });
    delete document.nodes[node_id].hash;
    if (Object.keys(document.nodes[node_id]).length === 0)
      delete document.nodes[node_id];
    await document.save();
  }

  async getSize(args: { documentId: string; user: User }): Promise<number> {
    return await this.documentRepository.getSize(args);
  }
}
