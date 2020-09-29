import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Document, Privacy } from './entities/document.entity';
import { DocumentRepository } from './repositories/document.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { SubscriptionsService } from './subscriptions.service';
import { DocumentGuestRepository } from './repositories/document-guest.repository';
import {
  CreateDocumentDTO,
  EditDocumentDTO,
  GetDocumentDTO,
  GetDocumentsDTO,
  SetDocumentStateDTO,
} from './dto/document.dto';
import { DocumentOperation } from './entities/document-operation.entity';
import { NodeService } from '../node/node.service';
import { concat, defer, from } from 'rxjs';
import { progressify, unFlatMap } from '../shared/shared';
import { Node } from '../node/entities/node.entity';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DocumentService {
  logger = new Logger('document-service');
  constructor(
    @InjectRepository(DocumentRepository)
    private documentRepository: DocumentRepository,
    private subscriptionsService: SubscriptionsService,
    private documentGuestRepository: DocumentGuestRepository,
    @Inject(forwardRef(() => NodeService))
    private nodeService: NodeService,
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
        this.subscriptionsService.delete.deleted(document, user.id);
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

  async getSize(args: { documentId: string }): Promise<number> {
    return await this.documentRepository.getSize(args);
  }

  async setState(dto: SetDocumentStateDTO): Promise<Document> {
    return await this.documentRepository.setState(dto);
  }

  async setDocumentStatus(
    event: DocumentOperation,
    document: Document,
  ): Promise<void> {
    await this.documentRepository.setDocumentStatus(event, document);
  }

  clone = async (dto: GetDocumentDTO): Promise<string> => {
    const documentA = await this.documentRepository.getDocumentById(dto);
    const ongoingOperation = documentA.status;
    if (ongoingOperation) return;

    const documentB = await this.documentRepository.createDocument({
      data: {
        name: documentA.name,
        privacy: Privacy.PRIVATE,
        guests: [],
      },
      userId: dto.userId,
    });
    documentB.state = documentA.state;
    await this.subscriptionsService.clone.preparing(documentA, dto.userId);
    const nodesA = await this.nodeService.getNodesMetaAndAHtml(dto);
    const cloneNodes$ = progressify<Node[]>(
      unFlatMap(10)(nodesA),
      nodes => from(this.nodeService.clone(documentB, nodes)),
      progress =>
        from(
          this.subscriptionsService.clone.nodesStarted(
            documentA,
            dto.userId,
            progress,
          ),
        ),
    );

    const finished$ = defer(async () => {
      documentB.size = await this.getSize({
        documentId: documentB.id,
      });
      await documentB.save();
      return from(
        this.subscriptionsService.clone.finished(documentA, dto.userId),
      );
    });
    const cloneDocument$ = concat(cloneNodes$, finished$).pipe(
      catchError(e => {
        this.logger.error(e.message);
        return from(
          this.subscriptionsService.clone.failed(documentA, dto.userId),
        );
      }),
    );
    cloneDocument$.subscribe();
    return documentB.id;
  };
}
