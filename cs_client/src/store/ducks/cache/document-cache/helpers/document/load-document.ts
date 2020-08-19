import { constructTree } from '::root/components/app/components/editor/document/hooks/get-document-meta/helpers/construct-tree';
import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { QDocumentMeta } from '::graphql/queries/document-meta';
import { getDefaultState } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-state';
import { getDefaultSelectedNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-selected-node_id';
import { getDefaultHighestNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-highest-node_id';

export const loadDocument = (
  state: DocumentCacheState,
  payload: QDocumentMeta,
): DocumentCacheState => {
  const nodes = constructTree({
    nodes: payload.node,
    privateNodes: payload.privateNodes,
  });

  delete payload.node;

  return {
    ...state,
    [payload.id]: {
      ...payload,
      nodes,
      state: {
        ...getDefaultState(),
        selectedNode_id: getDefaultSelectedNode_id(nodes),
        highestNode_id: getDefaultHighestNode_id(nodes),
      },
    },
  };
};
