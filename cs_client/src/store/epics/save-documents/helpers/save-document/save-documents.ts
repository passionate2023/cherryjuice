import { saveNodesMeta } from '::store/epics/save-documents/helpers/save-document/helpers/save-nodes-meta';
import { saveNewNodes } from '::store/epics/save-documents/helpers/save-document/helpers/save-new-nodes';
import {
  deleteDanglingNodes,
  saveDeletedNodes,
  SaveOperationState,
} from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { saveNodesContent } from '::store/epics/save-documents/helpers/save-document/helpers/save-nodes-content';
import { saveNewDocument } from '::store/epics/save-documents/helpers/save-document/helpers/save-new-document';
import { saveImages } from '::store/epics/save-documents/helpers/save-document/helpers/save-images';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { saveDocumentMeta } from './helpers/save-document-meta';

const saveDocuments = async (
  state: SaveOperationState,
): Promise<SaveOperationState> => {
  const editedDocuments = apolloCache.changes.document().unsaved;
  for (const documentId of editedDocuments) {
    await saveNewDocument({ state, documentId });
    await saveDeletedNodes({ state, documentId });
    await saveNewNodes({ state, documentId });
    await saveNodesMeta({ state, documentId });
    await saveImages({ state, documentId });
    await saveNodesContent({ state, documentId });
    await deleteDanglingNodes({ state, documentId });
    await saveDocumentMeta({ state, documentId });
    apolloCache.changes.resetDocumentChangesState(documentId);
  }

  return state;
};

export { saveDocuments };
