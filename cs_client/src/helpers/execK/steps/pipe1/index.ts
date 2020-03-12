import {
  getDDOE,
  getSelectedDDOEs,
  getIndexOfSelectionSubDDOEs,
  getIsolatedDDOESelection,
  deletedIsolatedSelection,
  guardAgainstSubDDOEIsTextNode
} from '::helpers/execK/steps/pipe1/ddoes';
import { getAHtml } from '::helpers/execK/helpers/html-to-ahtml';
import {
  applyTemporaryStamps,
  deleteTemporaryStamps,
  getAHtmlAnchors,
  splitSelected
} from '::helpers/execK/steps/pipe1/split-selection';

const pipe1 = ({
  selectionStartElement,
  selectionEndElement,
  startOffset,
  endOffset
}) => {
  const startDDOE = getDDOE(selectionStartElement);
  const endDDOE = getDDOE(selectionEndElement);

  const adjustedSelection = guardAgainstSubDDOEIsTextNode({
    selectionEndElement,
    selectionStartElement,
    startDDOE,
    endDDOE
  });
  selectionStartElement = adjustedSelection.selectionStartElement;
  selectionEndElement = adjustedSelection.selectionEndElement;

  applyTemporaryStamps({
    startElement: selectionStartElement,
    endElement: selectionEndElement
  });
  const { selectedDDOEs } = getSelectedDDOEs({ startDDOE, endDDOE });
  const {
    indexOfEndSubDDOE,
    indexOfStartSubDDOE
  } = getIndexOfSelectionSubDDOEs({
    endDDOE,
    startDDOE,
    selectionEndElement,
    selectionStartElement
  });

  const { isolatedSelection } = getIsolatedDDOESelection({
    selectedDDOEs,
    indexOfEndSubDDOE,
    indexOfStartSubDDOE
  });

  const { startAnchor, endAnchor } = deletedIsolatedSelection({
    selectedDDOEs,
    indexOfStartSubDDOE,
    indexOfEndSubDDOE
  });

  const { abstractHtml } = getAHtml({
    DDOEs: isolatedSelection,
    options: { useObjForTextNodes: true, serializeNonTextElements: true }
  });
  const { startNode, endNode, midNodes } = getAHtmlAnchors({ abstractHtml });
  const { left, selected, right } = splitSelected({
    aHtmlAnchors: {
      startNode,
      midNodes, //: wrapTextNodesInSpan(midNodes),
      endNode
    },
    startOffset,
    endOffset
  });

  [left, right, selected.leftEdge, selected.rightEdge].forEach(
    deleteTemporaryStamps
  );
  return {
    left,
    right,
    selected,
    startDDOE,
    endDDOE,
    startAnchor,
    endAnchor,
    adjustedSelection
  };
};

export { pipe1 };
