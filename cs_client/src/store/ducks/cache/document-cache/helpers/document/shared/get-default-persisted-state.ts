import { PersistedDocumentState } from '::store/ducks/cache/document-cache';

export const getDefaultPersistedState = (): PersistedDocumentState => ({
  selectedNode_id: 0,
  recentNodes: [],
  treeState: {
    '0': {},
  },
  scrollPositions: {},
  updatedAt: 0,
});
