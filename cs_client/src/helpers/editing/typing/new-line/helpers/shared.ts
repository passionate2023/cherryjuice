export const collectSiblings = (array: Node[] = []) => (node: Node): Node[] => {
  if (node?.nextSibling) {
    array.push(node.nextSibling);
    collectSiblings(array)(node.nextSibling);
  }
  return array;
};