import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { SaveOperationProps } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { localChanges } from '::graphql/cache/helpers/changes';

const saveNewDocument = async ({ state }: SaveOperationProps) => {
  const newDocuments = apolloCache.changes.document.created;

  for await (const documentId of newDocuments) {
    const document = apolloCache.document.get(documentId);
    if (document.folder === 'Unsaved') document.folder = null;
    const permanentDocumentId = await apolloCache.client.mutate({
      query: DOCUMENT_MUTATION.createDocument.query,
      variables: {
        document: { name: document.name },
      },
      path: DOCUMENT_MUTATION.createDocument.path,
    });

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
    apolloCache.changes.unsetModificationFlag(
      localChanges.DOCUMENT_CREATED,
      temporaryId,
    );
  }
};
export { saveNewDocument };
