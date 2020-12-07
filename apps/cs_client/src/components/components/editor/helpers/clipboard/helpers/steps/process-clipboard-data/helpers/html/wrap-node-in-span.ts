export const wrapNodeInSpan = (node: Text): Element => {
  const spanElement = document.createElement('span');
  spanElement.innerHTML = node.wholeText;
  return spanElement;
};
