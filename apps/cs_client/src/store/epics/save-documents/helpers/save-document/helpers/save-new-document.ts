import { apolloClient } from '::graphql/client/apollo-client';
import { SaveOperationProps } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { CREATE_DOCUMENT } from '::graphql/mutations/document/create-document';

const saveNewDocument = async ({ state, document }: SaveOperationProps) => {
  if (document.id.startsWith('new-document')) {
    const permanentDocumentId = await apolloClient.mutate(
      CREATE_DOCUMENT({
        document: {
          name: document.name,
          guests: document.guests,
          privacy: document.privacy,
        },
      }),
    );

    const temporaryId = document.id;
    if (permanentDocumentId) {
      state.swappedDocumentIds[temporaryId] = permanentDocumentId;
    } else {
      throw new Error('could not save document ' + document.id);
    }
  }
};
export { saveNewDocument };
