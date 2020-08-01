import { Injectable, Logger } from '@nestjs/common';
import { Document, Privacy } from './entities/document.entity';
import { DocumentRepository } from './repositories/document.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { DocumentSubscriptionsService } from './document.subscriptions.service';
import { DocumentGuestRepository } from './repositories/document-guest.repository';
import {
  CreateDocumentDTO,
  EditDocumentDTO,
  GetDocumentDTO,
  GetDocumentsDTO,
} from './dto/document.dto';

@Injectable()
export class DocumentService {
  logger = new Logger('document-service');
  constructor(
    @InjectRepository(DocumentRepository)
    private documentRepository: DocumentRepository,
    private subscriptionsService: DocumentSubscriptionsService,
    private documentGuestRepository: DocumentGuestRepository,
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

  async getDocuments(dto: GetDocumentsDTO): Promise<Document[]> {
    return this.documentRepository.getDocuments(dto);
  }

  async getDocumentById(dto: GetDocumentDTO): Promise<Document> {
    return this.documentRepository.getDocumentById(dto);
  }

  async getWDocumentById(dto: GetDocumentDTO): Promise<Document> {
    return this.documentRepository.getWDocumentById(dto);
  }

  async createDocument(dto: CreateDocumentDTO): Promise<Document> {
    const document = await this.documentRepository.createDocument(dto);
    await this.documentGuestRepository.setGuests({
      guests: dto.data.guests,
      documentId: document.id,
    });
    return document;
  }

  async editDocument(dto: EditDocumentDTO): Promise<Document> {
    const state = { guests: undefined };
    if (dto.meta.guests) {
      state.guests = dto.meta.guests;
      delete dto.meta.guests;
    }
    const document = await this.documentRepository.editDocument(dto);
    if (state.guests)
      await this.documentGuestRepository.setGuests({
        guests: state.guests,
        documentId: document.id,
      });
    return document;
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
        const document = new Document({
          name: '',
          userId: '',
          privacy: Privacy.PRIVATE,
        });
        document.id = id;
        this.subscriptionsService.import.deleted(document, user.id);
      });
    return deleteResult;
  }
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
  }: {
    userId: string;
    documentId: string;
    node_id: number;
    hash: string;
  }): Promise<Document> {
    const document = await this.getWDocumentById({ documentId, userId });
    document.nodes[node_id] = { hash };
    await document.save();
    return document;
  }
  async deleteNodesHash({
    documentId,
    node_id,
    userId,
  }: {
    userId: string;
    documentId: string;
    node_id: number;
  }): Promise<void> {
    const document = await this.getWDocumentById({
      documentId: documentId,
      userId,
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
