export const getIndexOfNode = (node: ChildNode): number => {
  if (!node.parentElement) throw Error('node has no parent');
  return Array.from(node.parentElement.childNodes).indexOf(node);
};
