import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache-helpers';
import {
  documentActionCreators,
  localChanges,
} from '::app/editor/document/reducer/action-creators';
import { SaveOperationProps } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { CreateNodeIt } from '::types/graphql/generated';

const adapt = ({
  child_nodes,
  createdAt,
  documentId,
  father_id,
  icon_id,
  name,
  node_id,
  node_title_styles,
  read_only,
  updatedAt,
  position,
  fatherId,
}: NodeCached & { position }): CreateNodeIt => ({
  child_nodes,
  createdAt,
  documentId,
  father_id,
  icon_id,
  name,
  node_id,
  node_title_styles,
  read_only,
  updatedAt,
  position,
  fatherId,
});

const mutateCreateNode = async ({ nodeId, mutate }) =>
  await new Promise((res, rej) => {
    const node = apolloCache.getNode(nodeId) as NodeCached & {
      position: number;
    };
    const meta: CreateNodeIt = adapt(node);
    mutate({
      variables: {
        file_id: node.documentId,
        node_id: `${node.node_id}`,
        meta,
      },
      update: (cache, { data }) => {
        res(data);
      },
    }).catch(rej);
  });

const saveNewNodes = async ({ nodes, mutate, state }: SaveOperationProps) => {
  const newNodes = Object.entries(nodes)
    .filter(([, attributes]) => attributes.new && !attributes.deleted)
    .map(([nodeId]) => nodeId);
  for (const nodeId of newNodes) {
    const data = await mutateCreateNode({
      nodeId,
      mutate,
    });
    const permanentNodeId = DOCUMENT_MUTATION.createNode.path(data);
    if (permanentNodeId) {
      const node: NodeCached = apolloCache.getNode(nodeId);
      node.id = permanentNodeId;
      apolloCache.setNode(permanentNodeId, node);
      apolloCache.deleteNode(nodeId);
      nodes[permanentNodeId] = nodes[nodeId];
      delete nodes[nodeId];
      node.child_nodes.forEach(node_id => {
        state.newFatherIds[node_id] = permanentNodeId;
      });
    }
    documentActionCreators.clearLocalChanges(nodeId, localChanges.IS_NEW);
  }
};
export { saveNewNodes };
