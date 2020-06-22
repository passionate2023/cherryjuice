import { Node } from '../../../../node/entities/node.entity';

const fn = str => {
  const values = /nodes_(\d+)__(\d+)_(\d+)/.exec(str);
  return {
    father_id: +values[1],
    startNode_id: +values[2],
    endNode_id: +values[3],
  };
};
const createNodes = (cmd: string) => {
  const { endNode_id, father_id, startNode_id } = fn(cmd);
  return Array.from({ length: endNode_id - startNode_id + 1 }).map((_, i) => {
    const node = new Node();
    node.name = `node ${father_id}.${i}`;
    node.node_id = i + startNode_id;
    node.father_id = father_id;
    node.createdAt = new Date();
    node.updatedAt = new Date();
    node.child_nodes = [];
    return node;
  });
};
const createTree = () => {
  const rootNode = new Node();
  rootNode.node_id = 0;
  rootNode.child_nodes = [];
  const nodes_0__1_3 = createNodes('nodes_0__1_3');
  const nodes_1__5_9 = createNodes('nodes_1__5_9');
  const nodes_2__10_15 = createNodes('nodes_2__10_15');
  rootNode.child_nodes.push(...nodes_0__1_3.map(node => node.node_id));
  nodes_0__1_3[0].ahtml =
    '[[[],null],[[{"_":"azira","tags":[["span",{"style":{"text-decoration":"line-through"}}]]}],null]]';
  nodes_0__1_3[0].child_nodes.push(...nodes_1__5_9.map(node => node.node_id));
  nodes_0__1_3[0].node_title_styles = JSON.stringify({
    color: '#dd00ce',
    fontWeight: 'bold',
    icon_id: 22,
  });

  nodes_0__1_3[1].child_nodes.push(...nodes_2__10_15.map(node => node.node_id));
  nodes_0__1_3[1].ahtml =
    '[[[],null],[[{"_":"node","tags":[["code",{"style":{"background-color":"#2B2B2B"}}]]}],null],[["\\tThe node to be cloned."],null]]';
  nodes_0__1_3[1].node_title_styles = JSON.stringify({
    color: '#00d3ce',
    fontWeight: 'bold',
    icon_id: 5,
  });

  nodes_0__1_3[2].node_title_styles = JSON.stringify({
    fontWeight: 'bold',
  });
  const nodes = [...nodes_0__1_3, ...nodes_1__5_9, ...nodes_2__10_15];
  return { nodes, rootNode };
};
export { createNodes, createTree };
