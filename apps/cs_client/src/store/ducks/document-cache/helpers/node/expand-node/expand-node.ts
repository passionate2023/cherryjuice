import { DocumentCacheState } from '::store/ducks/document-cache/document-cache';
import { SelectNodeParams } from '::store/ducks/document-cache/helpers/document/select-node';
import { ExpandNodeCommands } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/expand-node';
import { expandNode as _expandNode } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/expand-node';
import { collapseNode as _collapseNode } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/collapse/collapse-node';

export type ExpandNodeParams = SelectNodeParams & {
  expandChildren?: boolean;
  mode?: ExpandNodeCommands;
};
export const expandNode = (
  state: DocumentCacheState,
  { documentId, node_id, expandChildren, mode }: ExpandNodeParams,
): DocumentCacheState => {
  node_id = +node_id;
  const document = state.documents[documentId];
  _expandNode({
    nodes: document.nodes,
    tree: document.persistedState.treeState,
    node_id,
    expandChildren,
    mode,
  });
  return state;
};

export const collapseNode = (
  state: DocumentCacheState,
  { documentId, node_id }: SelectNodeParams,
): DocumentCacheState => {
  node_id = +node_id;
  const document = state.documents[documentId];
  _collapseNode(document.nodes, document.persistedState.treeState, node_id);
  return state;
};
