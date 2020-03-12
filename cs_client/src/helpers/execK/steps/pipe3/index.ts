import { Element } from '::helpers/execK/helpers/ahtml-to-html/element';
import { toNodes } from '::helpers/execK/helpers';
import { replaceElement } from '::helpers/execK/steps/pipe3/helpers';

const pipe3 = (
  { left, right, modifiedSelected },
  { startDDOE, endDDOE, startAnchor, endAnchor }
) => {
  const leftAHtmls = [
    left,
    modifiedSelected.leftEdge,
    ...modifiedSelected.midNodes
  ];
  const leftOversFromRightAHtml = [];
  const rightAHtmls = [modifiedSelected.rightEdge, right];

  const leftAHtmlsHasLeftOversFromAHtml =
    leftAHtmls[leftAHtmls.length - 1] !== '\n' && startDDOE !== endDDOE;
  if (leftAHtmlsHasLeftOversFromAHtml) {
    const lastIndexOfNewLineElement = leftAHtmls.lastIndexOf('\n');
    leftOversFromRightAHtml.push(
      ...leftAHtmls.splice(lastIndexOfNewLineElement + 1)
    );
  }

  const leftAHtmlsMultiLine = leftAHtmls.reduce(
    (acc, node, indexOfNode) =>
      node === '\n'
        ? indexOfNode === leftAHtmls.length - 1
          ? acc
          : [...acc, []]
        : (acc[acc.length - 1].push(Element({ node })), acc),
    [[]]
  );
  const childrenOfStartDDOE: string[] = leftAHtmlsMultiLine.shift();
  const adjacentToStartDDOE: string[] = leftAHtmlsMultiLine.reduce(
    (acc, DDOEs) => {
      const startDDOEShell = startDDOE.cloneNode();
      startDDOEShell.innerHTML = DDOEs.join('');
      acc.push(startDDOEShell.outerHTML);
      return acc;
    },
    []
  );

  const childrenElementsOfStartDDOE = childrenOfStartDDOE.map(toNodes);
  const adjacentElementsOfStartDDOE = adjacentToStartDDOE.map(toNodes);
  const childrenElementsOfEndDDOE = [
    ...leftOversFromRightAHtml,
    ...rightAHtmls
  ].map(node => toNodes(Element({ node })));

  replaceElement(startAnchor)(childrenElementsOfStartDDOE);
  startDDOE.after(...adjacentElementsOfStartDDOE);
  replaceElement(endAnchor)(childrenElementsOfEndDDOE);

  return {
    childrenElementsOfStartDDOE,
    adjacentElementsOfStartDDOE,
    childrenElementsOfEndDDOE
  };
};

export { pipe3 };
