import {
  CachedDocument,
  DocumentCacheState,
  QFullNode,
} from '::store/ducks/document-cache/document-cache';
import { newImagePrefix } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';
import { listNodeEditedAttributes } from '::store/ducks/document-cache/helpers/node/mutate-node-meta';

export type MutateNodeContentParams = {
  node_id: number;
  documentId: string;
  data: Partial<Pick<QFullNode, 'html' | 'image'>>;
  meta?: { deletedImages?: string[]; mode?: 'update-key-only' };
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
  { meta, documentId, node_id, data }: MutateNodeContentParams,
): DocumentCacheState => {
  const document: CachedDocument = state.documents[documentId];
  const node = document.nodes[node_id];
  const updatedAt = Date.now();

  if (meta?.mode !== 'update-key-only') {
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
  }
  document.localState.localUpdatedAt = updatedAt;
  listNodeEditedAttributes({
    document,
    attributes: Object.keys(data),
    node_id,
  });
  listDeletedImages(document, node_id, meta?.deletedImages);
  return state;
};
