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
import { getEditedDocuments } from '::store/selectors/cache/document/document';

const saveDocuments = async (
  state: SaveOperationState,
): Promise<SaveOperationState> => {

  const editedDocuments = getEditedDocuments();
  for (const document of editedDocuments) {
    state.deletedNodes[document.id] = {};
    await saveNewDocument({ state, document });
    await saveDeletedNodes({ state, document });
    await saveNewNodes({ state, document });
    await saveNodesMeta({ state, document });
    await saveImages({ state, document });
    await saveNodesContent({ state, document });
    await saveDocumentMeta({ state, document });
  }

  return state;
};

export { saveDocuments };
