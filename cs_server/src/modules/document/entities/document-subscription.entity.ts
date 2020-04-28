import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { pubSub, SUBSCRIPTIONS } from '../../shared/subscriptions';
import { Document } from './document.entity';

export enum DOCUMENT_SUBSCRIPTIONS {
  DOCUMENT_IMPORT_FINISHED = 'DOCUMENT_IMPORT_FINISHED',
  DOCUMENT_IMPORT_FAILED = 'DOCUMENT_IMPORT_FAILED',
  DOCUMENT_IMPORT_STARTED = 'DOCUMENT_IMPORT_STARTED',
  DOCUMENT_IMPORT_PREPARING = 'DOCUMENT_IMPORT_PREPARING',
}
registerEnumType(DOCUMENT_SUBSCRIPTIONS, {
  name: 'DOCUMENT_SUBSCRIPTIONS',
});

@ObjectType()
export class DocumentSubscription {
  userId: string;

  @Field(() => DOCUMENT_SUBSCRIPTIONS)
  eventType: DOCUMENT_SUBSCRIPTIONS;

  @Field(() => ID)
  documentId: string;

  @Field(() => ID)
  documentName: string;
  static async publish(
    eventType: DOCUMENT_SUBSCRIPTIONS,
    document: Document,
  ): Promise<void> {
    const payload: { document: DocumentSubscription } = {
      document: {
        documentId: document.id,
        eventType,
        documentName: document.name,
        userId: document.userId,
      },
    };
    await pubSub.publish(SUBSCRIPTIONS.DOCUMENT, payload);
    if (eventType === DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED)
      document.status = null;
    else document.status = eventType;
    await document.save();
  }
  static dispatch = {
    async importPreparing(document: Document): Promise<void> {
      await DocumentSubscription.publish(
        DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PREPARING,
        document,
      );
    },
    async importStarted(document: Document): Promise<void> {
      await DocumentSubscription.publish(
        DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_STARTED,
        document,
      );
    },
    async importFinished(document: Document): Promise<void> {
      await DocumentSubscription.publish(
        DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED,
        document,
      );
    },
    async importFailed(document: Document): Promise<void> {
      await DocumentSubscription.publish(
        DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FAILED,
        document,
      );
    },
  };
}
