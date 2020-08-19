import { CachedDocumentState } from '::store/ducks/cache/document-cache';

export const getDefaultState = (newDocument = false): CachedDocumentState => ({
  editedAttributes: [],
  editedNodes: {
    edited: {},
    created: newDocument ? [0] : [],
    deleted: [],
  },
  highestNode_id: 0,
  selectedNode_id: 0,
  recentNodes: [],
  localUpdatedAt: 0,
});
