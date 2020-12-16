import {
  CachedDocumentState,
  NodesDict,
} from '::store/ducks/document-cache/document-cache';
import { getDefaultHighestNode_id } from '::store/ducks/document-cache/helpers/document/shared/get-default-highest-node_id';

export const getDefaultLocalState = (
  documentId,
  nodes: NodesDict,
): CachedDocumentState => {
  const newDocument = documentId.startsWith('new-document');
  return {
    editedAttributes: [],
    editedNodes: {
      edited: {},
      created: newDocument ? [0] : [],
      deleted: [],
      deletedImages: {},
      updatedContentTs: {},
    },
    highestNode_id: getDefaultHighestNode_id(nodes),
    localUpdatedAt: 0,
    hash: '',
  };
};
