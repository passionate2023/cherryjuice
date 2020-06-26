import {
  DOCUMENT_SUBSCRIPTIONS as DS,
  DocumentSubscription,
} from './entities/document-subscription.entity';
import { Document } from './entities/document.entity';
import { DocumentRepository } from './repositories/document.repository';
import { Injectable } from '@nestjs/common';
import { pubSub, SUBSCRIPTIONS } from '../shared/subscriptions/subscriptions';

@Injectable()
export class DocumentSubscriptionsService {
  constructor(private documentRepository: DocumentRepository) {}
  private publishMessage = async (
    eventType: DS,
    document: Document,
  ): Promise<void> => {
    const payload: { document: DocumentSubscription } = {
      document: {
        documentId: document.id,
        eventType,
        documentName: document.name,
        userId: document.userId,
      },
    };
    await pubSub.publish(SUBSCRIPTIONS.DOCUMENT, payload);
  };
  private _ = (eventType: DS) => async (document: Document): Promise<void> => {
    await this.publishMessage(eventType, document);
    await this.documentRepository.setDocumentStatus(eventType, document);
  };

  import = {
    pending: this._(DS.IMPORT_PENDING),
    preparing: this._(DS.IMPORT_PREPARING),
    started: this._(DS.IMPORT_STARTED),
    finished: this._(DS.IMPORT_FINISHED),
    failed: this._(DS.IMPORT_FAILED),
    duplicate: this._(DS.IMPORT_DUPLICATE),
    deleted: this._(DS.DELETED),
  };
}
