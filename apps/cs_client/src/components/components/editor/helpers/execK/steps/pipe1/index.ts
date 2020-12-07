import {
  getDDOE,
  getSelectedDDOEs,
  getIsolatedDDOESelection,
  deletedIsolatedSelection,
  getIndexOfSubDDOE,
} from '::editor/helpers/execK/steps/pipe1/ddoes';
import { getAHtml } from '::editor/helpers/rendering/html-to-ahtml';
import {
  applyTemporaryStamps,
  getAHtmlAnchors,
  splitSelected,
} from '::editor/helpers/execK/steps/pipe1/split-selection';
import { optimizeAHtml } from '::editor/helpers/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/optimize-a-html';
import {
  guardAgainstDDOETagIsNotNeutral,
  guardAgainstSubDDOEIsTextNode,
} from '::editor/helpers/execK/steps/pipe1/guards';

export type SplitSelection = {
  adjustedSelection: { selectionEndElement: any; selectionStartElement: any };
  left: any;
  startDDOE: any;
  startAnchor: any;
  endAnchor: any;
  endDDOE: any;
  right: any;
  selectionContainsLinks: boolean;
  selected: { leftEdge: any; rightEdge: any; midNodes: any };
};
type Pipe1 = ({
  selectionStartElement,
  selectionEndElement,
  startOffset,
  endOffset,
  stampPrefix,
}: {
  selectionStartElement: any;
  selectionEndElement: any;
  startOffset: any;
  endOffset: any;
  stampPrefix?: any;
}) => SplitSelection;
const pipe1: Pipe1 = ({
  selectionStartElement,
  selectionEndElement,
  startOffset,
  endOffset,
  stampPrefix = '',
}) => {
  let startDDOE = getDDOE(selectionStartElement);
  let endDDOE = getDDOE(selectionEndElement);

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
    stampPrefix,
    offset: startOffset,
  });
  const { selectedDDOEs } = getSelectedDDOEs({ startDDOE, endDDOE });

  const indexOfStartSubDDOE = getIndexOfSubDDOE({
    DDOE: startDDOE,
    selectionElement: selectionStartElement,
  });
  const indexOfEndSubDDOE = getIndexOfSubDDOE({
    DDOE: endDDOE,
    selectionElement: selectionEndElement,
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

  const { abstractHtml, selectionContainsLinks } = getAHtml({
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
  [left, selected.leftEdge, selected.rightEdge, right] = optimizeAHtml({
    aHtml: [left, selected.leftEdge, selected.rightEdge, right],
  });
  return {
    left,
    right,
    selected,
    startDDOE,
    endDDOE,
    startAnchor,
    endAnchor,
    adjustedSelection,
    selectionContainsLinks,
  };
};

export { pipe1 };
