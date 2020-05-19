import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { SaveOperationProps } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { DocumentMutationToCreateDocumentArgs } from '::types/graphql/generated';
import { performMutation } from '::app/editor/document/hooks/save-document/helpers/shared';
import { localChanges } from '::graphql/cache/helpers/changes';

const saveNewDocument = async ({ mutate, state }: SaveOperationProps) => {
  const newDocuments = apolloCache.changes.document.created;

  for (const documentId of newDocuments) {
    const document = apolloCache.document.get(documentId);
    const data = await performMutation<DocumentMutationToCreateDocumentArgs>({
      variables: {
        document: { name: document.name },
      },
      mutate,
    });
    const permanentDocumentId = DOCUMENT_MUTATION.createDocument.path(data);
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
