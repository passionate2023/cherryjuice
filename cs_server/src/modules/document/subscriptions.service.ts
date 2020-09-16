import {
  OPERATION_CONTEXT,
  OPERATION_TYPE,
  OPERATION_STATE,
  DocumentOperation,
} from './entities/document-operation.entity';
import { Document } from './entities/document.entity';
import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { DocumentRepository } from './repositories/document.repository';

export enum SubscriptionChannels {
  DOCUMENT = 'DOCUMENT',
}
export const pubSub = new PubSub();

type PublishMessageProps = {
  documentOperation: DocumentOperation;
  channel: SubscriptionChannels;
};

@Injectable()
export class SubscriptionsService {
  constructor(private documentRepository: DocumentRepository) {}
  private publishMessage = async ({
    documentOperation,
    channel,
  }: PublishMessageProps): Promise<void> => {
    await pubSub.publish(channel, { documentOperation });
  };
  private _ = (
    props: Pick<DocumentOperation, 'state' | 'progress' | 'context' | 'type'>,
  ) => async (document: Document, userId: string): Promise<void> => {
    const documentOperation: DocumentOperation = {
      ...props,
      target: {
        id: document.id,
        hash: document.hash,
        name: document.name,
      },
      userId,
    };
    await this.publishMessage({
      documentOperation,
      channel: SubscriptionChannels.DOCUMENT,
    });
    await this.documentRepository.setDocumentStatus(
      documentOperation,
      document,
    );
  };

  import = {
    pending: this._({
      type: OPERATION_TYPE.IMPORT,
      state: OPERATION_STATE.PENDING,
    }),
    preparing: this._({
      type: OPERATION_TYPE.IMPORT,
      state: OPERATION_STATE.PREPARING,
    }),
    started: this._({
      type: OPERATION_TYPE.IMPORT,
      state: OPERATION_STATE.STARTED,
    }),
    finished: this._({
      type: OPERATION_TYPE.IMPORT,
      state: OPERATION_STATE.FINISHED,
    }),
    failed: this._({
      type: OPERATION_TYPE.IMPORT,
      state: OPERATION_STATE.FAILED,
    }),
    duplicate: this._({
      type: OPERATION_TYPE.IMPORT,
      state: OPERATION_STATE.DUPLICATE,
    }),
  };

  delete = {
    deleted: this._({
      type: OPERATION_TYPE.DELETE,
      state: OPERATION_STATE.FINISHED,
    }),
  };

  export = {
    pending: this._({
      type: OPERATION_TYPE.EXPORT,
      state: OPERATION_STATE.PENDING,
    }),
    preparing: this._({
      type: OPERATION_TYPE.EXPORT,
      state: OPERATION_STATE.PREPARING,
    }),
    nodesStarted: this._({
      type: OPERATION_TYPE.EXPORT,
      state: OPERATION_STATE.STARTED,
      context: OPERATION_CONTEXT.NODES,
    }),
    imagesStarted: this._({
      type: OPERATION_TYPE.EXPORT,
      state: OPERATION_STATE.STARTED,
      context: OPERATION_CONTEXT.IMAGES,
    }),
    finished: this._({
      type: OPERATION_TYPE.EXPORT,
      state: OPERATION_STATE.FINISHED,
    }),
    failed: this._({
      type: OPERATION_TYPE.EXPORT,
      state: OPERATION_STATE.FAILED,
    }),
  };
}
