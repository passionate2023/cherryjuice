import { Document } from '../../document/entities/document.entity';
import {
  DOCUMENT_SUBSCRIPTIONS,
  DocumentSubscription,
} from '../../document/entities/document-subscription.entity';
import {
  pubSub,
  SUBSCRIPTIONS,
} from '../../shared/subscriptions/subscriptions';

const publishGraphqlMessage = async (
  eventType: DOCUMENT_SUBSCRIPTIONS,
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
const updateDocumentStatus = async (
  event: DOCUMENT_SUBSCRIPTIONS,
  document: Document,
): Promise<void> => {
  if (event === DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED)
    document.status = null;
  else document.status = event;
  await document.save();
};
const createThreshold = (
  eventType: DOCUMENT_SUBSCRIPTIONS,
) => async document => {
  await publishGraphqlMessage(eventType, document);
  await updateDocumentStatus(eventType, document);
};
const importThreshold = {
  preparing: createThreshold(DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PREPARING),
  started: createThreshold(DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_STARTED),
  finished: createThreshold(DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED),
  failed: createThreshold(DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FAILED),
};

export { importThreshold };
