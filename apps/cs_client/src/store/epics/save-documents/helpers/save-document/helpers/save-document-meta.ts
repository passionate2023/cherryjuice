import { SaveOperationProps } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { apolloClient } from '::graphql/client/apollo-client';
import { DocumentGuestOt } from '@cherryjuice/graphql-types';
import { EDIT_DOCUMENT_META } from '::graphql/mutations/document/edit-document-meta';

const saveDocumentMeta = async ({ document, state }: SaveOperationProps) => {
  const editedAttributes = Object.fromEntries(
    document.localState.editedAttributes.map(attribute => [
      attribute,
      document[attribute],
    ]),
  );
  editedAttributes.updatedAt = document.localState.localUpdatedAt;
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
