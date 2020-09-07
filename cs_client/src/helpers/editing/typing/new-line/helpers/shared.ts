export const collectSiblings = (array: Node[] = []) => (node: Node): Node[] => {
  if (node?.nextSibling) {
    array.push(node.nextSibling);
    collectSiblings(array)(node.nextSibling);
  }
  return array;
};

export const getSpaceAtStart = (element: Element): undefined | string => {
  const execArray = /(^\s+)/.exec(element.firstChild.textContent);
  if (execArray)
    return execArray[1]
};
