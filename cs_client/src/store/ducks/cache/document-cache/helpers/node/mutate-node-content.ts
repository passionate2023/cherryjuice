import {
  DocumentCacheState,
  QFullNode,
} from '::store/ducks/cache/document-cache';
import { newImagePrefix } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';
import { listNodeEditedAttributes } from '::store/ducks/cache/document-cache/helpers/node/mutate-node-meta';

export type MutateNodeContentParams = {
  node_id: number;
  documentId: string;
  data: Partial<Pick<QFullNode, 'html' | 'image'>>;
  meta?: { deletedImages?: string[]; mode?: 'update-key-only' };
};
export const mutateNodeContent = (
  state: DocumentCacheState,
  { meta, documentId, node_id, data }: MutateNodeContentParams,
): DocumentCacheState => {
  const document = state[documentId];
  const node = document.nodes[node_id];
  const updatedAt = Date.now();

  const editedNodes = document.state.editedNodes;
  if (meta?.mode !== 'update-key-only') {
    if (meta?.deletedImages) {
      node.image = node.image.filter(
        ({ id }) => !meta.deletedImages.includes(id),
      );
      if (!editedNodes.deletedImages[node_id])
        editedNodes.deletedImages[node_id] = [];
      editedNodes.deletedImages[node_id].push(
        ...meta.deletedImages.filter(id => !id.startsWith(newImagePrefix)),
      );
    } else if (data.image) {
      node.image.push(...data.image);
    } else if (data.html) {
      node.html = data.html;
    }
    node.updatedAt = updatedAt;
  }
  document.state.localUpdatedAt = updatedAt;
  listNodeEditedAttributes({
    document,
    attributes: Object.keys(data),
    node_id,
  });
  return state;
};
