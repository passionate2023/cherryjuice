import { SaveOperationProps } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { EditDocumentIt } from '::types/graphql/generated';
import { EDIT_DOCUMENT_META } from '::graphql/mutations/edit-document-meta';

type MutationVariables = { file_id: string; meta: EditDocumentIt };
const saveDocumentMeta = async ({ state, documentId }: SaveOperationProps) => {
  const editedAttributes = Object.fromEntries(
    Array.from(apolloCache.changes.document(documentId).meta),
  );

  if (!editedAttributes.updatedAt)
    editedAttributes.updatedAt = new Date().getTime();
  await apolloCache.client.mutate(
    EDIT_DOCUMENT_META({
      file_id: state.swappedDocumentIds[documentId] || documentId,
      meta: {
        ...editedAttributes,
        updatedAt: editedAttributes.updatedAt,
        guests: [],
      },
    }),
  );
};

export { saveDocumentMeta };
