import { SaveOperationProps } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { EditDocumentIt } from '::types/graphql/generated';

type MutationVariables = { file_id: string; meta: EditDocumentIt };
const saveDocumentMeta = async ({ state, documentId }: SaveOperationProps) => {
  const editedAttributes = Object.fromEntries(
    Array.from(apolloCache.changes.document(documentId).meta),
  );

  if (!editedAttributes.updatedAt)
    editedAttributes.updatedAt = new Date().getTime();
  await apolloCache.client.mutate<MutationVariables, string>({
    ...DOCUMENT_MUTATION.editDocument,
    variables: {
      file_id: state.swappedDocumentIds[documentId] || documentId,
      meta: { ...editedAttributes, updatedAt: editedAttributes.updatedAt },
    },
  });
};

export { saveDocumentMeta };
