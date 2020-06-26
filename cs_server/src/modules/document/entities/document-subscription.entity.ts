import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum DOCUMENT_SUBSCRIPTIONS {
  IMPORT_PENDING = 'IMPORT_PENDING',
  IMPORT_PREPARING = 'IMPORT_PREPARING',
  IMPORT_STARTED = 'IMPORT_STARTED',
  IMPORT_FINISHED = 'IMPORT_FINISHED',
  IMPORT_FAILED = 'IMPORT_FAILED',
  IMPORT_DUPLICATE = 'IMPORT_DUPLICATE',
  DELETED = 'DELETED',
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
