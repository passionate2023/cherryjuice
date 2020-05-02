import { Document } from '../../document/entities/document.entity';
import {
  DOCUMENT_SUBSCRIPTIONS,
  DocumentSubscription,
} from '../../document/entities/document-subscription.entity';
import {
  pubSub,
  SUBSCRIPTIONS,
} from '../../shared/subscriptions/subscriptions';
import { DocumentDTO } from '../imports.service';

const publishGraphqlMessage = async (
  eventType: DOCUMENT_SUBSCRIPTIONS,
  document: Document | DocumentDTO,
): Promise<void> => {
  const payload: { document: DocumentSubscription } = {
    document: {
      documentId: document.id,
      eventType,
      documentName: document.name,
      userId: document instanceof Document ? document.userId : document.user.id,
    },
  };
  await pubSub.publish(SUBSCRIPTIONS.DOCUMENT, payload);
};
const updateDocumentStatus = async (
  event: DOCUMENT_SUBSCRIPTIONS,
  document: Document | DocumentDTO,
): Promise<void> => {
  if (document instanceof Document) {
    if (event === DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED)
      document.status = null;
    else document.status = event;
    await document.save();
  }
};
const EVENTS_TO_NOT_PERSIST = {
  [DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_DELETED]: true,
};
const createThreshold = (eventType: DOCUMENT_SUBSCRIPTIONS) => async (
  document: Document | DocumentDTO,
): Promise<void> => {
  await publishGraphqlMessage(eventType, document);
  if (!EVENTS_TO_NOT_PERSIST[eventType])
    await updateDocumentStatus(eventType, document);
};
const importThreshold = {
  pending: createThreshold(DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PENDING),
  preparing: createThreshold(DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PREPARING),
  started: createThreshold(DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_STARTED),
  finished: createThreshold(DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED),
  failed: createThreshold(DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FAILED),
  duplicate: createThreshold(DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_DUPLICATE),
  deleted: createThreshold(DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_DELETED),
};

export { importThreshold };
