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
  const document = state[documentId];
  document.persistedState.scrollPositions[node_id] = position;
  document.persistedState.updatedAt = Date.now();
  return state;
};
