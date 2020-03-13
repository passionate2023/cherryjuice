import {
  getDDOE,
  getSelectedDDOEs,
  getIndexOfSelectionSubDDOEs,
  getIsolatedDDOESelection,
  deletedIsolatedSelection,
  guardAgainstSubDDOEIsTextNode,
  guardAgainstDDOETagIsNotNeutral,
} from '::helpers/execK/steps/pipe1/ddoes';
import { getAHtml } from '::helpers/execK/helpers/html-to-ahtml';
import {
  applyTemporaryStamps,
  deleteTemporaryStampsFromAHtml,
  getAHtmlAnchors,
  splitSelected,
} from '::helpers/execK/steps/pipe1/split-selection';
import { optimizeAHtml } from '::helpers/clipboard/optimize-ahtml';

const pipe1 = ({
  selectionStartElement,
  selectionEndElement,
  startOffset,
  endOffset,
}) => {
  let startDDOE = getDDOE(selectionStartElement);
  let endDDOE = getDDOE(selectionEndElement);
  debugger;
  const adjustedSelection = guardAgainstSubDDOEIsTextNode({
    selectionEndElement,
    selectionStartElement,
    startDDOE,
    endDDOE,
  });
  selectionStartElement = adjustedSelection.selectionStartElement;
  selectionEndElement = adjustedSelection.selectionEndElement;

  const neutralDDOEs = guardAgainstDDOETagIsNotNeutral({
    startDDOE,
    endDDOE,
    selectionStartElement,
    selectionEndElement,
  });
  startDDOE = neutralDDOEs.startDDOE;
  endDDOE = neutralDDOEs.endDDOE;
  selectionStartElement = neutralDDOEs.selectionStartElement;
  selectionEndElement = neutralDDOEs.selectionEndElement;

  applyTemporaryStamps({
    startElement: selectionStartElement,
    endElement: selectionEndElement,
  });
  const { selectedDDOEs } = getSelectedDDOEs({ startDDOE, endDDOE });
  const {
    indexOfEndSubDDOE,
    indexOfStartSubDDOE,
  } = getIndexOfSelectionSubDDOEs({
    endDDOE,
    startDDOE,
    selectionEndElement,
    selectionStartElement,
  });

  const { isolatedSelection } = getIsolatedDDOESelection({
    selectedDDOEs,
    indexOfEndSubDDOE,
    indexOfStartSubDDOE,
  });

  const { startAnchor, endAnchor } = deletedIsolatedSelection({
    selectedDDOEs,
    indexOfStartSubDDOE,
    indexOfEndSubDDOE,
  });

  const { abstractHtml } = getAHtml({
    DDOEs: isolatedSelection,
    options: { useObjForTextNodes: true, serializeNonTextElements: true },
  });

  const { startNode, endNode, midNodes } = getAHtmlAnchors({
    abstractHtml,
  });
  let { left, selected, right } = splitSelected({
    aHtmlAnchors: {
      startNode,
      midNodes, //: wrapTextNodesInSpan(midNodes),
      endNode,
    },
    startOffset,
    endOffset,
  });
  [left, selected.leftEdge, selected.rightEdge, right] = optimizeAHtml(
    { aHtml: [left, selected.leftEdge, selected.rightEdge, right] },
    { addEmptyLineBeforeHeader: false, keepClassAttribute: true },
  );
  debugger;
  // [left, right, selected.leftEdge, selected.rightEdge].forEach(
  //   deleteTemporaryStampsFromAHtml
  // );
  return {
    left,
    right,
    selected,
    startDDOE,
    endDDOE,
    startAnchor,
    endAnchor,
    adjustedSelection,
  };
};

export { pipe1 };
