import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { pubSub, SUBSCRIPTIONS } from '../../shared/subscriptions';

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
  @Field(() => DOCUMENT_SUBSCRIPTIONS)
  eventType: DOCUMENT_SUBSCRIPTIONS;

  @Field(() => ID)
  documentId: string;

  @Field(() => ID)
  documentName: string;

  static dispatch = {
    importPreparing(documentId: string, documentName: string): void {
      const document: DocumentSubscription = {
        documentId,
        eventType: DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PREPARING,
        documentName,
      };
      pubSub.publish(SUBSCRIPTIONS.DOCUMENT, { document });
    },
    importStarted: (documentId: string, documentName: string): void => {
      const document: DocumentSubscription = {
        documentId,
        eventType: DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_STARTED,
        documentName,
      };
      pubSub.publish(SUBSCRIPTIONS.DOCUMENT, { document });
    },
    importFinished(documentId: string, documentName: string): void {
      const document: DocumentSubscription = {
        documentId,
        eventType: DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED,
        documentName,
      };
      pubSub.publish(SUBSCRIPTIONS.DOCUMENT, { document });
    },
    importFailed(documentId: string, documentName: string): void {
      const document: DocumentSubscription = {
        documentId,
        eventType: DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FAILED,
        documentName,
      };
      pubSub.publish(SUBSCRIPTIONS.DOCUMENT, { document });
    },
  };
}
