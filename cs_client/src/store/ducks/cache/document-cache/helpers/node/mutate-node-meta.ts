import {
  DocumentCacheState,
  QFullNode,
} from '::store/ducks/cache/document-cache';
export type MutateNodeMetaParams = {
  node_id: number;
  documentId: string;
  data: Partial<Omit<QFullNode, 'html' | 'image'>>;
  meta?: { deletedImages?: string[]; mode?: 'update-key-only' };
};
export const mutateNodeMeta = (
  state: DocumentCacheState,
  params: MutateNodeMetaParams | MutateNodeMetaParams[],
): DocumentCacheState => {
  if (!Array.isArray(params)) params = [params];
  const document = state[params[0].documentId];
  if (
    params.length > 1 &&
    params.some(param => param.documentId !== document.id)
  )
    throw new Error('nodes must have the same documentId');
  params.forEach(({ node_id, data }) => {
    const node = document.nodes[node_id];
    const updatedAt = Date.now();

    const editedNodes = document.state.editedNodes;
    if (!editedNodes.edited[node_id]) editedNodes.edited[node_id] = [];
    Object.entries(data).forEach(([k, v]) => {
      node[k] = v;
      if (!editedNodes.edited[node_id].includes(k))
        editedNodes.edited[node_id].push(k);
    });
    node.updatedAt = updatedAt;
    document.state.localUpdatedAt = updatedAt;
  });

  return state;
};
