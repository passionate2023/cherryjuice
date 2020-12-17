import {
  CachedDocument,
  DocumentCacheState,
  QFullNode,
} from '::store/ducks/document-cache/document-cache';
import { newImagePrefix } from '@cherryjuice/editor';
import { listNodeEditedAttributes } from '::store/ducks/document-cache/helpers/node/mutate-node-meta';

export type MutateNodeContentFlag = 'list' | 'unlist';
export type MutateNodeContentParams = {
  node_id: number;
  documentId: string;
  data: Partial<Pick<QFullNode, 'html' | 'image'>>;
  meta?: {
    deletedImages?: string[];
    flag?: MutateNodeContentFlag;
  };
};

const listDeletedImages = (
  document: CachedDocument,
  node_id,
  deletedImages?: string[],
) => {
  if (deletedImages) {
    if (!document.localState.editedNodes.deletedImages[node_id])
      document.localState.editedNodes.deletedImages[node_id] = [];
    document.localState.editedNodes.deletedImages[node_id].push(
      ...deletedImages.filter(id => !id.startsWith(newImagePrefix)),
    );
  }
};

export const mutateNodeContent = (
  state: DocumentCacheState,
  { meta = {}, documentId, node_id, data }: MutateNodeContentParams,
): DocumentCacheState => {
  const document: CachedDocument = state.documents[documentId];
  if (!document) {
    // eslint-disable-next-line no-console
    console.error('no document exception:', {
      documentId,
      node_id,
      data,
      meta,
    });
    return state;
  }
  const node = document.nodes[node_id];
  const updatedAt = Date.now();

  if (meta.flag) {
    listNodeEditedAttributes({
      document,
      attributes: ['html', 'image'],
      node_id,
      mode: meta.flag,
    });
  } else {
    if (meta?.deletedImages) {
      node.image = node.image.filter(
        ({ id }) => !meta.deletedImages.includes(id),
      );
    }
    if (data.image) {
      node.image.push(...data.image);
    }
    if (data.html) {
      node.html = data.html;
    }
    node.updatedAt = updatedAt;
    listNodeEditedAttributes({
      document,
      attributes: Object.keys(data),
      node_id,
    });
    listDeletedImages(document, node_id, meta?.deletedImages);
  }
  document.localState.localUpdatedAt = updatedAt;
  return state;
};
