import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { getDefaultSelectedNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-selected-node_id';

export type SelectNodeParams = {
  documentId: string;
  node_id: number;
  hash?: string;
};

export const selectNode = (
  state: DocumentCacheState,
  { documentId, node_id, hash }: SelectNodeParams,
): DocumentCacheState => {
  node_id = +node_id;
  const document = state.documents[documentId];
  if (!document?.nodes[node_id] && document.nodes && document.nodes[0])
    node_id = getDefaultSelectedNode_id(document.nodes);
  if (node_id && document?.nodes[node_id]) {
    document.localState.hash = hash;
    document.persistedState.selectedNode_id = node_id;
    if (!document.persistedState.recentNodes.includes(node_id)) {
      document.persistedState.recentNodes.push(node_id);
    }
    document.persistedState.recentNodes = document.persistedState.recentNodes.filter(
      node_id => document.nodes[node_id],
    );
    if (document.persistedState.recentNodes.length > 20)
      document.persistedState.recentNodes = document.persistedState.recentNodes.slice(
        document.persistedState.recentNodes.length - 20,
      );
    document.persistedState.localUpdatedAt = Date.now();
  }
  return state;
};

export type CloseNodeParams = {
  documentId: string;
  node_id?: number;
  node_ids?: number[];
};

export const closeNode = (
  state: DocumentCacheState,
  { documentId, node_id, node_ids }: CloseNodeParams,
): DocumentCacheState => {
  const document = state.documents[documentId];
  const nodesToClose = new Set(node_ids || [node_id]);
  document.persistedState.recentNodes = document.persistedState.recentNodes.filter(
    _node_id => !nodesToClose.has(_node_id),
  );

  if (nodesToClose.has(document.persistedState.selectedNode_id))
    document.persistedState.selectedNode_id =
      document.persistedState.recentNodes[
        document.persistedState.recentNodes.length - 1
      ] || 0;
  document.persistedState.localUpdatedAt = Date.now();
  return state;
};
