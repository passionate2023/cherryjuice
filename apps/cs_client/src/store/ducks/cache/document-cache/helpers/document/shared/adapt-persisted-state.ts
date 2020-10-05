import { DocumentState } from '@cherryjuice/graphql-types';
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
    bookmarks,
    scrollPositions,
    selectedNode_id,
    treeState,
    updatedAt,
    lastOpenedAt,
  },
  nodes,
}: {
  persistedState?: DocumentState;
  nodes: NodesDict;
}): PersistedDocumentState => {
  return {
    bookmarks,
    recentNodes,
    treeState: unFlattenTree(treeState, nodes),
    scrollPositions: Object.fromEntries(
      scrollPositions.map(({ node_id, x, y }) => [node_id, [x, y]]),
    ),
    selectedNode_id: selectedNode_id || getDefaultSelectedNode_id(nodes),
    updatedAt,
    lastOpenedAt,
    localUpdatedAt: updatedAt,
    localLastOpenedAt: lastOpenedAt,
  };
};

export const adaptToPersistedState = ({
  recentNodes,
  bookmarks,
  selectedNode_id,
  treeState,
  scrollPositions,
  localUpdatedAt,
  localLastOpenedAt,
  updatedAt,
  lastOpenedAt,
}: PersistedDocumentState): DocumentState => {
  return {
    updatedAt: new Date(localUpdatedAt || updatedAt),
    lastOpenedAt: new Date(localLastOpenedAt || lastOpenedAt),
    recentNodes,
    bookmarks,
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
