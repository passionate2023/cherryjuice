import {
  CachedDocument,
  DocumentCacheState,
} from '::store/ducks/cache/document-cache';
import { SelectNodeParams } from '::store/ducks/cache/document-cache/helpers/document/select-node';

export const documentHasNode = (
  document: CachedDocument,
  node_id: number,
): boolean => Boolean(node_id && document?.nodes && document?.nodes[node_id]);

export const addBookmark = (
  state: DocumentCacheState,
  { documentId, node_id }: SelectNodeParams,
): DocumentCacheState => {
  node_id = +node_id;
  const document = state.documents[documentId];
  if (documentHasNode(document, node_id)) {
    if (!document.persistedState.bookmarks.includes(node_id)) {
      document.persistedState.bookmarks.push(node_id);
    }
    document.persistedState.localUpdatedAt = Date.now();
  }
  return state;
};
