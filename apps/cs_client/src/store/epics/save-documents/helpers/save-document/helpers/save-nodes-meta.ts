import {
  SaveOperationProps,
  SaveOperationState,
} from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { apolloClient } from '::graphql/client/apollo-client';
import { NodeMetaIt } from '::types/graphql';
import { updateDocumentId } from '::store/epics/save-documents/helpers/save-document/helpers/shared';
import { EDIT_NODE_META } from '::graphql/mutations/document/edit-node-meta';
import { unFlatMap } from '::helpers/shared';
import { QFullNode } from '::store/ducks/cache/document-cache';

const swapNodeIdIfApplies = (state: SaveOperationState) => (nodeId: string) =>
  state.swappedNodeIds[nodeId] ? state.swappedNodeIds[nodeId] : nodeId;
const swapFatherIdIfApplies = (state: SaveOperationState) => (
  node: QFullNode,
): QFullNode => {
  let fatherId = node.fatherId;
  if (state.swappedNodeIds[node.fatherId]) {
    fatherId = state.swappedNodeIds[node.fatherId];
  }
  return { ...node, fatherId };
};

const saveNodesMeta = async ({ state, document }: SaveOperationProps) => {
  const editedNodeMeta = Object.entries(
    document.localState.editedNodes.edited,
  ).filter(([id]): boolean => !state.deletedNodes[document.id][id]);
  const nodeMetaIts: NodeMetaIt[] = [];
  for await (const [node_id, editedAttributes] of editedNodeMeta) {
    let node = document.nodes[node_id];
    node = swapFatherIdIfApplies(state)(node);
    node = updateDocumentId(state)(node);
    const meta: NodeMetaIt = {
      updatedAt: node.updatedAt,
      node_id: node.node_id,
    };
    editedAttributes.forEach(attribute => {
      if (attribute !== 'html' && attribute !== 'image')
        meta[attribute] = node[attribute];
    });
    nodeMetaIts.push(meta);
  }
  for await (const chunk of unFlatMap(200)(nodeMetaIts)) {
    await apolloClient.mutate(
      EDIT_NODE_META({
        file_id: state.swappedDocumentIds[document.id] || document.id,
        meta: chunk,
      }),
    );
  }
};

export { saveNodesMeta, swapNodeIdIfApplies, swapFatherIdIfApplies };
