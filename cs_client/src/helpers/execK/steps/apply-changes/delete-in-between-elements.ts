const childElementsAndTextNodes: Map<HTMLElement, HTMLElement[]> = new Map();
const getChildElementsAndTextNodes = (parentElement: HTMLElement) =>
  // @ts-ignore
  [childElementsAndTextNodes.get(parentElement)].flatMap(memoizedElement =>
    memoizedElement
      ? memoizedElement
      : Array.from(parentElement.childNodes).filter(
          node =>
            node.nodeType === Node.TEXT_NODE ||
            node.nodeType === Node.ELEMENT_NODE
        )
  );
const deleteInBetweenElements = ({
  midNodes,
  endElementRoot,
  currentLine,
  currentElementIndex
}) => {
  let node = midNodes.shift();
  if (node === '\n') {
    currentLine = currentLine.nextElementSibling;
    currentElementIndex = 0;
  } else {
    const nextElementSibling = getChildElementsAndTextNodes(currentLine)[
      currentElementIndex
    ];
    if (nextElementSibling && nextElementSibling !== endElementRoot) {
      nextElementSibling.parentElement.removeChild(nextElementSibling);
    }
  }
  if (midNodes.length)
    deleteInBetweenElements({
      midNodes,
      endElementRoot,
      currentLine,
      currentElementIndex: currentElementIndex++
    });
};

export { deleteInBetweenElements };
