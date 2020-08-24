import {
  DocumentCacheState,
  QFullNode,
} from '::store/ducks/cache/document-cache';
import { removeDuplicates } from '::helpers/array-helpers';
import { newImagePrefix } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';

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
  let mutatedNode: QFullNode;

  const editedNodes = document.state.editedNodes;
  const nodeEditedAttributes = [
    ...(editedNodes.edited[node_id] || []),
    ...Object.keys(data),
  ];
  const nodeDeletedImages = [...(editedNodes.deletedImages[node_id] || [])];
  if (meta?.mode === 'update-key-only') {
    mutatedNode = node;
  } else {
    if (meta?.deletedImages) {
      mutatedNode = {
        ...node,
        image: node.image.filter(({ id }) => !meta.deletedImages.includes(id)),
        updatedAt: updatedAt,
      };
      nodeDeletedImages.push(
        ...meta.deletedImages.filter(id => !id.startsWith(newImagePrefix)),
      );
    } else if (data.image) {
      mutatedNode = {
        ...node,
        image: [...node.image, ...data.image],
        updatedAt: updatedAt,
      };
    } else if (data.html) {
      mutatedNode = {
        ...node,
        ...data,
        updatedAt: updatedAt,
      };
    }
  }
  return {
    ...state,
    [documentId]: {
      ...document,
      nodes: {
        ...document.nodes,
        [node_id]: mutatedNode,
      },
      state: {
        ...document.state,
        localUpdatedAt: updatedAt,
        editedNodes: {
          ...editedNodes,
          edited: {
            ...editedNodes.edited,
            [node_id]: removeDuplicates([
              ...(editedNodes.edited[node_id] || []),
              ...nodeEditedAttributes,
            ]),
          },
          deletedImages: {
            ...editedNodes.deletedImages,
            [node_id]: removeDuplicates(nodeDeletedImages),
          },
        },
      },
    },
  };
};
