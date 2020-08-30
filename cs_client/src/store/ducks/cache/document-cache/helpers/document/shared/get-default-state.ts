import {
  CachedDocumentState,
  NodesDict,
} from '::store/ducks/cache/document-cache';
import { getDefaultSelectedNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-selected-node_id';
import { getDefaultHighestNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-highest-node_id';

const _getDefaultState = (newDocument = false): CachedDocumentState => ({
  editedAttributes: [],
  editedNodes: {
    edited: {},
    created: newDocument ? [0] : [],
    deleted: [],
    deletedImages: {},
  },
  highestNode_id: 0,
  selectedNode_id: 0,
  recentNodes: [],
  localUpdatedAt: newDocument ? Date.now() : 0,
});

type GetDefaultStateParams = {
  newDocument?: boolean;
  existingState?: CachedDocumentState;
  nodes?: NodesDict;
};

const defaultParams = {
  newDocument: false,
};
export const getDefaultState = ({
  existingState,
  newDocument,
  nodes,
}: GetDefaultStateParams = defaultParams): CachedDocumentState => {
  if (existingState && nodes ) {
    return {
      ..._getDefaultState(),
      recentNodes: existingState.recentNodes,
      selectedNode_id:
        existingState.selectedNode_id || getDefaultSelectedNode_id(nodes),
      highestNode_id: getDefaultSelectedNode_id(nodes),
    };
  } else if (nodes)
    return {
      ..._getDefaultState(),
      selectedNode_id: getDefaultSelectedNode_id(nodes),
      highestNode_id: getDefaultHighestNode_id(nodes),
    };
  else return _getDefaultState(newDocument);
};
