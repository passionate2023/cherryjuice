import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { SelectNodeParams } from '::store/ducks/cache/document-cache/helpers/document/select-node';
import {
  collapseNode as _collapseNode,
  expandNode as _expandNode,
} from '::store/ducks/cache/document-cache/helpers/node/expand-node/helpers/tree/tree';

export const expandNode = (
  state: DocumentCacheState,
  { documentId, node_id }: SelectNodeParams,
): DocumentCacheState => {
  node_id = +node_id;
  const document = state[documentId];
  _expandNode(document.nodes, document.state.treeState, node_id);
  return state;
};

export const collapseNode = (
  state: DocumentCacheState,
  { documentId, node_id }: SelectNodeParams,
): DocumentCacheState => {
  node_id = +node_id;
  const document = state[documentId];
  _collapseNode(document.nodes, document.state.treeState, node_id);
  return state;
};
