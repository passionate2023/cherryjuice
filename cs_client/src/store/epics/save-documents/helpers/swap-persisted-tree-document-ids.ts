import { SaveOperationState } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { swapPersistedTreeStateDocumentId } from '::root/components/app/components/editor/document/components/tree/components/node/hooks/persisted-tree-state/helpers';

const swapPersistedTreeDocumentIds = (state: SaveOperationState) => {
  const createdDocuments = Object.values(state.swappedDocumentIds);
  if (createdDocuments.length)
    swapPersistedTreeStateDocumentId(state.swappedDocumentIds);
};

export { swapPersistedTreeDocumentIds };
