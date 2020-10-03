import { QNodeMeta } from '::graphql/queries/document-meta';
import { PrivateNode } from '::types/graphql';
import { NodesDict } from '::store/ducks/cache/document-cache';

type Props = {
  nodes: QNodeMeta[];
  privateNodes: PrivateNode[];
};
const constructTree = ({
  nodes: nodesArray = [],
  privateNodes,
}: Props): NodesDict => {
  let nodes: NodesDict;
  if (nodesArray.length) {
    nodes = Object.fromEntries(
      nodesArray.map(node => [
        node.node_id,
        {
          ...node,
          child_nodes: [...node.child_nodes],
          image: [...(node['image'] || [])],
        },
      ]),
    );
    privateNodes.forEach(({ node_id, father_id }) => {
      const fatherNode = nodes[father_id];
      if (fatherNode) {
        const indexOfChildNode = fatherNode.child_nodes.indexOf(node_id);
        if (indexOfChildNode !== -1) {
          fatherNode.child_nodes.splice(indexOfChildNode, 1);
        }
      }
    });
  }
  return nodes;
};

export { constructTree };
