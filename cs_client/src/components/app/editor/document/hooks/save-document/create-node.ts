import { NodeCached } from '::types/graphql/adapters';
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
}: NodeCached): CreateNodeIt => ({
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
});

const mutateCreateNode = async ({ cache, nodeId, mutate }) =>
  await new Promise((res, rej) => {
    const node: NodeCached = cache.data.get('Node:' + nodeId);
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

export { mutateCreateNode };
