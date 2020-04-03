import { aHtmlToElement } from '::helpers/execK/helpers/ahtml-to-html/element';
import { toNodes } from '::helpers/execK/helpers';
import { replaceElement } from '::helpers/execK/steps/pipe3/helpers';
import { getDDOE } from '::helpers/execK/steps/pipe1/ddoes';
const aHtmlsToElements = (
  { childrenOfStartDDDE, midDDOEs, childrenOfEndDDDE },
  { startDDOE },
) => ({
  childrenElementsOfStartDDOE: childrenOfStartDDDE.map(node =>
    toNodes(aHtmlToElement({ node })),
  ),
  adjacentElementsOfStartDDOE: midDDOEs
    .reduce((acc, DDOEs) => {
      const startDDOEShell = startDDOE.cloneNode();
      startDDOEShell.innerHTML = DDOEs.map(node =>
        aHtmlToElement({ node }),
      ).join('');
      acc.push(startDDOEShell.outerHTML);
      return acc;
    }, [])
    .map(toNodes),
  childrenElementsOfEndDDOE: childrenOfEndDDDE.map(node =>
    toNodes(aHtmlToElement({ node })),
  ),
});

const applyLineStyle = ({ lineStyle, startDDOE, endDDOE, midDDOEs }) => {
  [startDDOE, ...midDDOEs, endDDOE].forEach(element => {
    if (lineStyle.deleteAll) {
      element.style = {};
    } else if (lineStyle.delete.length) {
      lineStyle.delete.forEach(propertyName => {
        element.style[propertyName] = '';
      });
      if (element.getAttribute('style') === '')
        element.removeAttribute('style');
    } else {
      Object.entries(lineStyle.line).forEach(
        ([propertyName, propertyValue]) => {
          // const elementHasProperty = element.style[propertyName];
          if (propertyValue) {
            element.style[
              propertyName
            ] = /*elementHasProperty ? 
        `${element.style[propertyName]} ${propertyValue}`
          :*/ propertyValue;
          }
        },
      );
    }
  });
};

const writeChangesToDom = (
  {
    childrenOfStartDDDE,
    midDDOEs,
    childrenOfEndDDDE,
    lineStyle = { line: {} },
  },
  { startAnchor, endAnchor },
) => {
  const startDDOE = getDDOE(startAnchor);
  const endDDOE = getDDOE(endAnchor);
  const {
    adjacentElementsOfStartDDOE,
    childrenElementsOfEndDDOE,
    childrenElementsOfStartDDOE,
  } = aHtmlsToElements(
    {
      childrenOfStartDDDE,
      midDDOEs,
      childrenOfEndDDDE,
    },
    { startDDOE },
  );

  replaceElement(startAnchor)(childrenElementsOfStartDDOE);
  startDDOE.after(...adjacentElementsOfStartDDOE);
  replaceElement(endAnchor)(childrenElementsOfEndDDOE);
  applyLineStyle({
    lineStyle,
    startDDOE,
    endDDOE,
    midDDOEs: adjacentElementsOfStartDDOE,
  });
  return {
    childrenElementsOfStartDDOE,
    adjacentElementsOfStartDDOE,
    childrenElementsOfEndDDOE,
  };
};

const splitAHtmlsToMultipleLines = ({ aHtmls }) => {
  return aHtmls.reduce(
    (acc, node, indexOfNode) =>
      node === '\n'
        ? indexOfNode === aHtmls.length - 1
          ? acc
          : [...acc, []]
        : (acc[acc.length - 1].push(node), acc),
    [[]],
  );
};

const pipe3 = (
  { left, right, modifiedSelected, lineStyle },
  { startDDOE, endDDOE, startAnchor, endAnchor },
) => {
  const leftAHtmls = [
    left,
    modifiedSelected.leftEdge,
    ...modifiedSelected.midNodes,
  ];
  const leftOversFromRightAHtml = [];
  const rightAHtmls = [modifiedSelected.rightEdge, right];

  const leftAHtmlsHasLeftOversFromAHtml =
    leftAHtmls[leftAHtmls.length - 1] !== '\n' && startDDOE !== endDDOE;
  if (leftAHtmlsHasLeftOversFromAHtml) {
    const lastIndexOfNewLineElement = leftAHtmls.lastIndexOf('\n');
    leftOversFromRightAHtml.push(
      ...leftAHtmls.splice(lastIndexOfNewLineElement + 1),
    );
  }

  const leftAHtmlsMultiLine = splitAHtmlsToMultipleLines({
    aHtmls: leftAHtmls,
  });

  return writeChangesToDom(
    {
      lineStyle,
      childrenOfStartDDDE: leftAHtmlsMultiLine.shift(),
      midDDOEs: leftAHtmlsMultiLine,
      childrenOfEndDDDE: [...leftOversFromRightAHtml, ...rightAHtmls],
    },
    { startAnchor, endAnchor },
  );
};

export { pipe3, writeChangesToDom, splitAHtmlsToMultipleLines };
