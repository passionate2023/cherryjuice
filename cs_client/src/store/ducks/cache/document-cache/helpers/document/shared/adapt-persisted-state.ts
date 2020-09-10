import { DocumentState } from '::types/graphql/generated';
import {
  NodesDict,
  PersistedDocumentState,
} from '::store/ducks/cache/document-cache';
import {
  flattenTree,
  unFlattenTree,
} from '::store/ducks/cache/document-cache/helpers/node/expand-node/helpers/tree/tree';
import { getDefaultSelectedNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-selected-node_id';

export const adaptFromPersistedState = ({
  persistedState: {
    recentNodes,
    scrollPositions,
    selectedNode_id,
    treeState,
    updatedAt,
  },
  nodes,
}: {
  persistedState?: DocumentState;
  nodes: NodesDict;
}): PersistedDocumentState => {
  return {
    recentNodes: recentNodes,
    treeState: unFlattenTree(treeState, nodes),
    scrollPositions: Object.fromEntries(
      scrollPositions.map(({ node_id, x, y }) => [node_id, [x, y]]),
    ),
    selectedNode_id: selectedNode_id || getDefaultSelectedNode_id(nodes),
    updatedAt,
  };
};

export const adaptToPersistedState = ({
  recentNodes,
  selectedNode_id,
  treeState,
  scrollPositions,
  updatedAt,
}: PersistedDocumentState): DocumentState => {
  return {
    updatedAt: new Date(updatedAt),
    recentNodes,
    selectedNode_id,
    treeState: flattenTree(treeState),
    scrollPositions: Object.entries(scrollPositions).map(
      ([node_id, [x, y]]) => ({
        node_id: +node_id,
        x,
        y,
      }),
    ),
  };
};
