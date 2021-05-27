import {
  CachedDocument,
  DocumentCacheState,
  QFullNode,
} from '::store/ducks/document-cache/document-cache';
import { MutateNodeContentFlag } from '::store/ducks/document-cache/helpers/node/mutate-node-content';

export const listNodeEditedAttributes = ({
  document,
  attributes,
  node_id,
  mode = 'list',
}: {
  document: CachedDocument;
  attributes: string[];
  node_id: number;
  mode?: MutateNodeContentFlag;
}) => {
  const editedNodes = document.localState.editedNodes;
  if (!editedNodes.edited[node_id]) editedNodes.edited[node_id] = [];
  attributes.forEach(k => {
    const index = editedNodes.edited[node_id].indexOf(k);
    const attributeExists = index !== -1;
    if (mode === 'list') {
      if (!attributeExists) editedNodes.edited[node_id].push(k);
    } else if (mode === 'unlist')
      if (attributeExists) editedNodes.edited[node_id].splice(index, 1);
  });
};

export type MutateNodeData = Partial<Omit<QFullNode, 'html' | 'image'>>;
export type MutateNodeMetaParams = {
  node_id: number;
  documentId: string;
  data: MutateNodeData;
  meta?: { deletedImages?: string[]; mode?: 'update-key-only' };
};
export const mutateNodeMeta = (
  state: DocumentCacheState,
  params: MutateNodeMetaParams[],
): DocumentCacheState => {
  const document = state.documents[params[0].documentId];
  if (
    params.length > 1 &&
    params.some(param => param.documentId !== document.id)
  )
    throw new Error('nodes must have the same documentId');
  params.forEach(({ node_id, data }) => {
    const node = document.nodes[node_id];
    const updatedAt = Date.now();
    Object.entries(data).forEach(([k, v]) => {
      node[k] = v;
    });
    listNodeEditedAttributes({
      document,
      attributes: Object.keys(data),
      node_id,
    });
    node.updatedAt = updatedAt;
    document.localState.localUpdatedAt = updatedAt;
  });

  return state;
};
