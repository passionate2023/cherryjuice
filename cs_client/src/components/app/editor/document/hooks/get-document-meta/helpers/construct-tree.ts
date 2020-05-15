import { TEditedNodes } from '::app/editor/document/reducer/initial-state';
import { NodeCached, NodeMeta } from '::types/graphql/adapters';
import { QUERY_NODE_META } from '::graphql/queries';
import { apolloCache } from '::graphql/cache-helpers';

type Props = {
  data: any;
  localChanges: TEditedNodes;
};
const constructTree = ({
  data,
  localChanges,
}: Props): Map<number, NodeMeta> => {
  let nodes: Map<number, NodeMeta>;
  const nodesArray = QUERY_NODE_META.path(data) || [];
  if (nodesArray.length) {
    nodes = new Map(nodesArray.map(node => [node.node_id, node]));
    Object.entries(localChanges).forEach(
      ([nodeId, { edited, new: isNew, deleted }]) => {
        const node = apolloCache.getNode(nodeId) as NodeCached & {
          previous_sibling_node_id;
        };
        if (!node) return;
        if (edited?.meta) {
          nodes.set(node.node_id, node);
        }
        if (isNew || deleted) {
          const fatherNode = nodes.get(node.father_id);
          if (isNew) {
            if (!fatherNode.child_nodes.includes(node.node_id)) {
              const position =
                node.previous_sibling_node_id === -1
                  ? -1
                  : fatherNode.child_nodes.indexOf(
                      node.previous_sibling_node_id,
                    ) + 1;
              position === -1
                ? fatherNode.child_nodes.push(node.node_id)
                : fatherNode.child_nodes.splice(position, 0, node.node_id);
              delete node.previous_sibling_node_id;
              // @ts-ignore
              apolloCache.setNode(nodeId, { ...node, position });
            }
            nodes.set(node.node_id, node);
          } else if (deleted) {
            if (fatherNode.child_nodes.includes(node.node_id)) {
              const nodeIndexInParentNodeChildNodes = fatherNode.child_nodes.indexOf(
                node.node_id,
              );
              fatherNode.child_nodes.splice(nodeIndexInParentNodeChildNodes, 1);
            }
          }
        }
      },
    );
  }
  return nodes;
};

export { constructTree };
