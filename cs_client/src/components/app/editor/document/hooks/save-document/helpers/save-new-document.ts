import { apolloCache } from '::graphql/cache/apollo-cache';
import { SaveOperationProps } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { CREATE_DOCUMENT } from '::graphql/mutations/create-document';

const saveNewDocument = async ({ state, documentId }: SaveOperationProps) => {
  if (apolloCache.changes.document(documentId).created.includes(documentId)) {
    const document = apolloCache.document.get(documentId);
    if (document.folder === 'Unsaved') document.folder = null;
    const permanentDocumentId = await apolloCache.client.mutate(
      CREATE_DOCUMENT({
        document: { name: document.name, owner: document.owner },
      }),
    );

    const temporaryId = document.id;
    if (permanentDocumentId) {
      apolloCache.document.swapId({
        oldId: document.id,
        newId: permanentDocumentId,
      });
      state.swappedDocumentIds[temporaryId] = permanentDocumentId;
    } else {
      throw new Error('could not save document ' + document.id);
    }
  }
};
export { saveNewDocument };
