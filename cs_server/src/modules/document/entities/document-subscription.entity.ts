import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum DOCUMENT_SUBSCRIPTIONS {
  DOCUMENT_IMPORT_PENDING = 'DOCUMENT_IMPORT_PENDING',
  DOCUMENT_IMPORT_PREPARING = 'DOCUMENT_IMPORT_PREPARING',
  DOCUMENT_IMPORT_STARTED = 'DOCUMENT_IMPORT_STARTED',
  DOCUMENT_IMPORT_FINISHED = 'DOCUMENT_IMPORT_FINISHED',
  DOCUMENT_IMPORT_FAILED = 'DOCUMENT_IMPORT_FAILED',
  DOCUMENT_IMPORT_DUPLICATE = 'DOCUMENT_IMPORT_DUPLICATE',
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
}
