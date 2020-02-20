const getLineChildren = line => Array.from(line.childNodes);
const getRootParent = el =>
  el.parentElement.classList.contains('rich-text__line')
    ? el
    : getRootParent(el.parentElement);
const getLineDiv = el =>
  el.parentElement.classList.contains('rich-text__line')
    ? el.parentElement
    : getLineDiv(el.parentElement);
const mapNodesToTextLength = xs =>
  xs.map(el =>
    el.nodeType === 1
      ? el.innerText.length
      : el.nodeType === 3
      ? el.wholeText.length
      : 0
  );
const findAnchors = ({ line, startOffset, endOffset }) =>
  mapNodesToTextLength(getLineChildren(line)).reduce(
    (acc, val, i) => {
      acc.tl += val;
      if (startOffset < acc.tl && acc.s === -1) acc.s = i;
      if (endOffset <= acc.tl && acc.e === -1) acc.e = i;

      return acc;
    },
    {
      tl: 0,
      s: -1,
      e: -1
    }
  );

const createWordRange = () => {
  const range = window.getSelection().getRangeAt(0);
  const { startOffset: caretOffset, startContainer } = range;
  const line = getLineDiv(startContainer);
  const lineChildren = getLineChildren(line);
  const text = line.innerText;
  const parentElement = getRootParent(startContainer);
  const parentElementIndex = lineChildren.indexOf(parentElement);
  const containerOffset = mapNodesToTextLength(lineChildren).reduce(
    (acc, val, i) => (i < parentElementIndex ? acc + val : acc),
    0
  );
  // @ts-ignore
  const lh = text.substring(0, containerOffset + caretOffset);
  // @ts-ignore
  const rh = text.substring(containerOffset + caretOffset);

  let lw: any = /\b[A-Za-z]+$/.exec(lh);
  let rw: any = /^[A-Za-z]+\b/.exec(rh);
  if (lw && !rw) rw = { 0: '', index: 0 };
  if (!lw && rw) lw = { 0: '', index: lh.length };
  if (!lw && !rw) throw Error('No adjacent word');

  const word = lw[0] + rw[0];
  const startOffset = lw['index'];
  const endOffset = startOffset + word.length;
  const { s, e } = findAnchors({
    line,
    startOffset,
    endOffset
  });

  return {
    startElement: line.childNodes[s],
    endElement: line.childNodes[e],
    startOffset: startOffset - containerOffset,
    endOffset: endOffset - containerOffset,
    containerOffset
  };
};
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

export { getSelection, createWordRange };
