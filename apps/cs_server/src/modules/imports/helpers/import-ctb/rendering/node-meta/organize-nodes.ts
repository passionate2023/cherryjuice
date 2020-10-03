import { Node } from '../../../../../node/entities/node.entity';
import { nodeTitleStyle } from './node-title-style';

const organizeData = async (data): Promise<Map<number, Node>> => {
  const nodes: Map<number, Node> = new Map(
    data.map(node => [node.node_id, node]),
  );

  data.forEach(node => {
    const parentNode = nodes.get(node.father_id);
    if (parentNode) {
      parentNode.child_nodes.push(node.node_id);
    }

    node.node_title_styles = nodeTitleStyle({
      is_richtxt: node.is_richtxt,
      is_ro: node.is_ro,
    });
  });

  data.forEach(node => {
    node.child_nodes.sort(
      // @ts-ignore
      (a, b) => nodes.get(a).sequence - nodes.get(b).sequence,
    );
  });
  return nodes;
};

export { organizeData };
