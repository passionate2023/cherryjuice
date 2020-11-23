import { DocumentCacheState } from '::store/ducks/document-cache/document-cache';

type CopyNodeMode = 'copy' | 'cut';

export type CopyNodeParams = {
  node_id: number;
  mode: CopyNodeMode;
  recursive?: boolean;
  documentId: string;
};
export const copyNode = (
  state: DocumentCacheState,
  params: CopyNodeParams,
): DocumentCacheState => {
  state.copiedNode = params;
  return state;
};
