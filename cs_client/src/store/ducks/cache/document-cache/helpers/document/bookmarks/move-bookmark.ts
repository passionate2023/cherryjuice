import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { Direction, move } from '::helpers/shared';
import { documentHasNode } from '::store/ducks/cache/document-cache/helpers/document/bookmarks/add-bookmark';

export type MoveBookmarkProps = {
  documentId: string;
  node_id: number;
  direction: Direction;
};
export const moveBookmark = (
  state: DocumentCacheState,
  { documentId, node_id, direction }: MoveBookmarkProps,
): DocumentCacheState => {
  const document = state.documents[documentId];
  if (documentHasNode(document, node_id)) {
    document.persistedState.bookmarks = move(
      document.persistedState.bookmarks,
      node_id,
      direction,
    );
    document.persistedState.localUpdatedAt = Date.now();
  }
  return state;
};
