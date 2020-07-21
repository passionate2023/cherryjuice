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
    userId: string,
  ): Promise<void> => {
    const payload: { document: DocumentSubscription } = {
      document: {
        id: document.id,
        status: eventType,
        name: document.name,
        userId,
        hash: document.hash,
      },
    };
    await pubSub.publish(SUBSCRIPTIONS.DOCUMENT, payload);
  };
  private _ = (eventType: DS) => async (
    document: Document,
    userId: string,
  ): Promise<void> => {
    await this.publishMessage(eventType, document, userId);
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

  export = {
    pending: this._(DS.EXPORT_PENDING),
    preparing: this._(DS.EXPORT_PREPARING),
    nodesStarted: this._(DS.EXPORT_NODES_STARTED),
    imagesStarted: this._(DS.EXPORT_IMAGES_STARTED),
    finished: this._(DS.EXPORT_FINISHED),
    failed: this._(DS.EXPORT_FAILED),
  };
}
