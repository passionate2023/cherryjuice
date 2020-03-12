import { setSelection } from '::helpers/execK/steps/restore-selection';

const getLineChildren = line => Array.from(line.childNodes);
const getRootParent = el =>
  el.parentElement.parentElement.getAttribute('id') === 'rich-text'
    ? el
    : getRootParent(el.parentElement);
const getLineDiv = el =>
  el.parentElement.parentElement.getAttribute('id') === 'rich-text'
    ? el.parentElement
    : getLineDiv(el.parentElement);
const mapNodesToText = xs =>
  xs.map(el =>
    el.nodeType === 1 ? el.innerText : el.nodeType === 3 ? el.wholeText : ''
  );
const mapTextToLength = xs => xs.map(str => str.length);
const findAnchors = ({ line, startOffset, endOffset }) => {
  return mapNodesToText(getLineChildren(line)).reduce(
    (acc, val, i) => {
      const l = val.length;
      if (startOffset < acc.tl + l && acc.s === -1) {
        acc.s = i;
        // acc.so = i > 0 ? acc.tl + l - startOffset : startOffset;
        acc.so = i > 0 ? startOffset - acc.tl : startOffset;
      }
      if (endOffset <= acc.tl + l && acc.e === -1) {
        acc.e = i;
        // acc.eo = acc.tl + l + 1 - endOffset;
        acc.eo = endOffset - acc.tl;
      }

      acc.tl += l;
      return acc;
    },
    {
      tl: 0,
      s: -1,
      e: -1,
      so: 0,
      eo: 0
    }
  );
};

const createWordRange = () => {
  const range = window.getSelection().getRangeAt(0);
  const { startOffset: caretOffset, startContainer } = range;
  const line = getLineDiv(startContainer);
  const lineChildren = getLineChildren(line);
  const text = line.innerText;
  const parentElement = getRootParent(startContainer);
  const parentElementIndex = lineChildren.indexOf(parentElement);
  const containerOffset = mapTextToLength(mapNodesToText(lineChildren)).reduce(
    (acc, val, i) => (i < parentElementIndex ? acc + val : acc),
    0
  );
  // @ts-ignore
  const lh = text.substring(0, containerOffset + caretOffset);
  // @ts-ignore
  const rh = text.substring(containerOffset + caretOffset);

  let lw: any = /\b[0-9_A-Za-z]+$/.exec(lh);
  let rw: any = /^[0-9_A-Za-z]+\b/.exec(rh);
  if (lw && !rw) rw = { 0: '', index: 0 };
  if (!lw && rw) lw = { 0: '', index: lh.length };
  if (!lw && !rw) throw Error('No adjacent word');

  const word = lw[0] + rw[0];
  const startOffset = lw['index'];
  const endOffset = startOffset + word.length;
  const { s, e, so, eo } = findAnchors({
    line,
    startOffset,
    endOffset
  });

  return {
    startElement: line.childNodes[s],
    endElement: line.childNodes[e],
    startOffset: so, //startOffset - (s > 0 ? containerOffset : 0),
    endOffset: eo //endOffset - containerOffset,
  };
};


const getSelection = ({ collapsed }: { collapsed?: boolean } = {}) => {
  const selection = document.getSelection();
  if (selection.rangeCount === 0) throw new Error("can't find the cursor");
  if (selection.getRangeAt(0).collapsed && !collapsed)
    setSelection(createWordRange());

  const range = document.getSelection().getRangeAt(0);
  return {
    startElement: range.startContainer,
    endElement: range.endContainer,
    startOffset: range.startOffset,
    endOffset: range.endOffset
  };
};

export { getSelection, getRootParent, getLineChildren };
