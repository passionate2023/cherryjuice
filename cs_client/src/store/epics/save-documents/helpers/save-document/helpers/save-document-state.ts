import { SaveOperationProps } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { apolloClient } from '::graphql/client/apollo-client';
import { SET_DOCUMENT_STATE } from '::graphql/mutations/document/set-document-state';
import { adaptToPersistedState } from '::store/ducks/cache/document-cache/helpers/document/shared/adapt-persisted-state';

const saveDocumentState = async ({ document, state }: SaveOperationProps) => {
  await apolloClient.mutate(
    SET_DOCUMENT_STATE({
      file_id: state.swappedDocumentIds[document.id] || document.id,
      state: adaptToPersistedState(document.persistedState),
    }),
  );
};

export { saveDocumentState };
