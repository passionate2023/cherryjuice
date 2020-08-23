import { SaveOperationProps } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { apolloClient } from '::graphql/client/apollo-client';
import { DocumentGuestOt } from '::types/graphql/generated';
import { EDIT_DOCUMENT_META } from '::graphql/mutations/document/edit-document-meta';

const saveDocumentMeta = async ({ document, state }: SaveOperationProps) => {
  const editedAttributes = Object.fromEntries(
    document.state.editedAttributes.map(attribute => [
      attribute,
      document[attribute],
    ]),
  );
  if (!editedAttributes.updatedAt)
    editedAttributes.updatedAt = new Date().getTime();
  if (editedAttributes.guests)
    editedAttributes.guests = editedAttributes.guests.map(
      ({ userId, email, accessLevel }) =>
        ({
          userId,
          email,
          accessLevel,
        } as DocumentGuestOt),
    );
  await apolloClient.mutate(
    EDIT_DOCUMENT_META({
      file_id: state.swappedDocumentIds[document.id] || document.id,
      meta: {
        ...editedAttributes,
        updatedAt: editedAttributes.updatedAt,
      },
    }),
  );
};

export { saveDocumentMeta };