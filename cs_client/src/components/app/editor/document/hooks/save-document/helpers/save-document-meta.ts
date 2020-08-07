import { SaveOperationProps } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { DocumentGuestOt, EditDocumentIt } from '::types/graphql/generated';
import { EDIT_DOCUMENT_META } from '::graphql/mutations/document/edit-document-meta';

type MutationVariables = { file_id: string; meta: EditDocumentIt };
const saveDocumentMeta = async ({ state, documentId }: SaveOperationProps) => {
  const editedAttributes = Object.fromEntries(
    Array.from(apolloCache.changes.document(documentId).meta),
  );

  if (!editedAttributes.updatedAt)
    editedAttributes.updatedAt = new Date().getTime();
  if (editedAttributes.guests)
    // remove apollo's __typename
    editedAttributes.guests = editedAttributes.guests.map(
      ({ userId, email, accessLevel }) =>
        ({
          userId,
          email,
          accessLevel,
        } as DocumentGuestOt),
    );
  await apolloCache.client.mutate(
    EDIT_DOCUMENT_META({
      file_id: state.swappedDocumentIds[documentId] || documentId,
      meta: {
        ...editedAttributes,
        updatedAt: editedAttributes.updatedAt,
      },
    }),
  );
};

export { saveDocumentMeta };
