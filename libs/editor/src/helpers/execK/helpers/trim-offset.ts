export const trimOffset = (node: Node, offset: number): [Node, number] => [
  node,
  node.textContent.length < offset ? node.textContent.length : offset,
];
