import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { CloseNodeParams } from '::store/ducks/cache/document-cache/helpers/document/select-node';

export const removeBookmark = (
  state: DocumentCacheState,
  { documentId, node_id, node_ids }: CloseNodeParams,
): DocumentCacheState => {
  const nodesToClose = new Set(node_ids || [node_id]);
  const document = state.documents[documentId];
  document.persistedState.bookmarks = document.persistedState.bookmarks.filter(
    _node_id => !nodesToClose.has(_node_id),
  );
  document.persistedState.localUpdatedAt = Date.now();
  return state;
};
