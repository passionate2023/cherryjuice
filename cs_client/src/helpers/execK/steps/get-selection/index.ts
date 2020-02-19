const getElementOfNode = node =>
  node.nodeType === 3 ? node.parentElement : node;
const getSelection = () => {
  const range = document.getSelection().getRangeAt(0);
  return {
    startElement: getElementOfNode(range.startContainer),
    endElement: getElementOfNode(range.endContainer),
    startOffset: range.startOffset,
    endOffset: range.endOffset
  };
};

export { getSelection };
