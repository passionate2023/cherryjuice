import { SelectNodeParams } from '::store/ducks/document-cache/helpers/document/select-node';
import { DocumentCacheState } from '::store/ducks/document-cache/document-cache';
import {
  _sortNodes,
  SortNodeCommand,
} from '::store/ducks/document-cache/helpers/node/sort-node/helpers/sort-nods';
import { listNodeEditedAttributes } from '::store/ducks/document-cache/helpers/node/mutate-node-meta';

export type SortNodeParams = SelectNodeParams & {
  command: SortNodeCommand;
};

export const sortNode = (
  state: DocumentCacheState,
  { documentId, node_id, command }: SortNodeParams,
): DocumentCacheState => {
  const document = state.documents[documentId];
  const nodes = document.nodes;
  const affectedNodes = _sortNodes({ nodes, node_id, command });
  const updatedAt = Date.now();
  affectedNodes.forEach(node_id => {
    listNodeEditedAttributes({
      document,
      node_id,
      attributes: ['child_nodes'],
    });
    nodes[node_id].updatedAt = updatedAt;
    document.localState.localUpdatedAt = updatedAt;
  });
  return state;
};
