import { saveNodesMeta } from '::store/epics/save-documents/helpers/save-document/helpers/save-nodes-meta';
import { saveNewNodes } from '::store/epics/save-documents/helpers/save-document/helpers/save-new-nodes';
import {
  saveDeletedNodes,
  SaveOperationState,
} from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { saveNodesContent } from '::store/epics/save-documents/helpers/save-document/helpers/save-nodes-content';
import { saveNewDocument } from '::store/epics/save-documents/helpers/save-document/helpers/save-new-document';
import { saveImages } from '::store/epics/save-documents/helpers/save-document/helpers/save-images';
import { saveDocumentMeta } from './helpers/save-document-meta';
import { saveDocumentState } from '::store/epics/save-documents/helpers/save-document/helpers/save-document-state';
import { CachedDocument } from '::store/ducks/document-cache/document-cache';

const saveDocuments = async (
  state: SaveOperationState,
  editedDocuments: CachedDocument[],
): Promise<SaveOperationState> => {
  for (const document of editedDocuments) {
    state.deletedNodes[document.id] = {};
    await saveNewDocument({ state, document });
    await saveDeletedNodes({ state, document });
    await saveNewNodes({ state, document });
    await saveNodesMeta({ state, document });
    await saveImages({ state, document });
    await saveNodesContent({ state, document });
    await saveDocumentMeta({ state, document });
    await saveDocumentState({ state, document });
  }

  if (location.pathname.startsWith('/document/new-document')) {
    const createdDocuments = Object.values(state.swappedDocumentIds);
    state.newSelectedDocumentId = createdDocuments.pop();
  }
  return state;
};

export { saveDocuments };
