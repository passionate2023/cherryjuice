import {
  DocumentCacheState,
  NodeScrollPosition,
} from '::store/ducks/cache/document-cache';
import { SelectNodeParams } from '::store/ducks/cache/document-cache/helpers/document/select-node';

export type SetScrollPositionParams = SelectNodeParams & {
  position: NodeScrollPosition;
};
export const setScrollPosition = (
  state: DocumentCacheState,
  { documentId, node_id, position }: SetScrollPositionParams,
) => {
  const document = state.documents[documentId];
  document.persistedState.scrollPositions[node_id] = position;
  document.persistedState.localUpdatedAt = Date.now();
  return state;
};
