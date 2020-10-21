import { PersistedDocumentState } from '::store/ducks/document-cache/document-cache';

export const getDefaultPersistedState = (): PersistedDocumentState => ({
  selectedNode_id: 0,
  treeState: {
    '0': {},
  },
  scrollPositions: {},
  recentNodes: [],
  bookmarks: [],
  updatedAt: 0,
  localUpdatedAt: 0,
  lastOpenedAt: 0,
  localLastOpenedAt: 0,
});
