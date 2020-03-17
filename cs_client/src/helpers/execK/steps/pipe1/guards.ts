import {
  sizeTags,
  styleTags,
} from '::helpers/execK/steps/apply-command/apply-tag/calculate-tag';
import {
  applyTemporaryStamps,
  deleteTemporaryStamps,
} from '::helpers/execK/steps/pipe1/split-selection';

const guardAgainstDDOETagIsNotNeutral = ({
  startDDOE,
  endDDOE,
  selectionStartElement,
  selectionEndElement,
}) => {
  const startDDOEIsNotNeutral =
    styleTags.includes(startDDOE.localName) ||
    sizeTags.includes(startDDOE.localName);
  const endDDOEIsNotNeutral =
    styleTags.includes(endDDOE.localName) ||
    sizeTags.includes(endDDOE.localName);
  const startDDOEEqualsEndDDOE = startDDOE === endDDOE;

  if (startDDOEIsNotNeutral || endDDOEIsNotNeutral) {
    const { start, end } = applyTemporaryStamps({
      startElement: selectionStartElement,
      endElement: selectionEndElement,
    });
    if (startDDOEIsNotNeutral) {
      const spanElement = document.createElement('span');
      spanElement.innerHTML = startDDOE.outerHTML;
      startDDOE.parentElement.replaceChild(spanElement, startDDOE);
      startDDOE = spanElement;
    }
    if (endDDOEIsNotNeutral) {
      if (startDDOEEqualsEndDDOE) {
        endDDOE = startDDOE;
      } else {
        const spanElement = document.createElement('span');
        spanElement.innerHTML = endDDOE.outerHTML;
        endDDOE.parentElement.replaceChild(spanElement, endDDOE);
        endDDOE = spanElement;
      }
    }
    selectionStartElement = startDDOE.querySelector(`[${start}]`);
    selectionEndElement = endDDOE.querySelector(`[${end}]`);
    deleteTemporaryStamps({
      startElement: selectionStartElement,
      endElement: selectionEndElement,
    });
  }
  return { startDDOE, endDDOE, selectionStartElement, selectionEndElement };
};
const guardAgainstSubDDOEIsTextNode = ({
  selectionStartElement,
  selectionEndElement,
  startDDOE,
  endDDOE,
}) => {
  const startSubDDOEIsTextNode =
    startDDOE === selectionStartElement.parentElement &&
    selectionStartElement.nodeType === 3;
  const endSubDDOEIsTextNode =
    endDDOE === selectionEndElement.parentElement &&
    selectionEndElement.nodeType === 3;
  const startSelectionEqualsEndSelection =
    selectionStartElement === selectionEndElement;

  if (startSubDDOEIsTextNode) {
    const spanElement = document.createElement('span');
    spanElement.innerHTML = selectionStartElement.wholeText;
    selectionStartElement.parentElement.replaceChild(
      spanElement,
      selectionStartElement,
    );
    selectionStartElement = spanElement;
  } else if (selectionStartElement.nodeType === Node.TEXT_NODE)
    selectionStartElement = selectionStartElement.parentElement;
  if (endSubDDOEIsTextNode) {
    if (startSelectionEqualsEndSelection) {
      selectionEndElement = selectionStartElement;
    } else {
      const spanElement = document.createElement('span');
      spanElement.innerHTML = selectionEndElement.wholeText;
      selectionEndElement.parentElement.replaceChild(
        spanElement,
        selectionEndElement,
      );
      selectionEndElement = spanElement;
    }
  } else if (selectionEndElement.nodeType === Node.TEXT_NODE)
    selectionEndElement = selectionEndElement.parentElement;
  return { selectionStartElement, selectionEndElement };
};

const guardAgainstEditorIsDDOE = ({
  selectionStartElement,
  selectionEndElement,
  startOffset,
  endOffset,
}) => {
  const editor = document.querySelector('#rich-text');
  const editorIsStartDDOE = selectionStartElement.parentElement === editor;
  const editorIsEndDDOE = selectionEndElement.parentElement === editor;
  const selectionStartEqualsEndElement =
    selectionStartElement === selectionEndElement;
  if (editorIsStartDDOE) {
    const selectionElementIsTextNode =
      selectionStartElement.nodeType === Node.TEXT_NODE;
    const spanElement = document.createElement('span');
    if (selectionElementIsTextNode) {
      spanElement.innerHTML = `<span>${selectionStartElement.wholeText ||
        ''}</span>`;
      selectionStartElement.parentElement.replaceChild(
        spanElement,
        selectionStartElement,
      );
      selectionStartElement = spanElement.firstChild;
    } else {
      if (selectionStartElement.children.length) {
        selectionStartElement = selectionStartElement.children[0];
      } else {
        selectionStartElement.appendChild(spanElement);
        selectionStartElement = spanElement;
      }
    }
  }
  if (editorIsEndDDOE) {
    if (selectionStartEqualsEndElement)
      selectionEndElement = selectionStartElement;
    else {
      const selectionElementIsTextNode =
        selectionEndElement.nodeType === Node.TEXT_NODE;
      const spanElement = document.createElement('span');
      if (selectionElementIsTextNode) {
        spanElement.innerHTML = `<span>${selectionEndElement.wholeText ||
          ''}</span>`;
        selectionEndElement.parentElement.replaceChild(
          spanElement,
          selectionEndElement,
        );
        selectionEndElement = spanElement.firstChild;
      } else {
        if (selectionEndElement.children.length) {
          selectionEndElement = selectionEndElement.children[0];
        } else {
          selectionEndElement.appendChild(spanElement);
          selectionEndElement = spanElement;
        }
      }
    }
  }
  return { selectionEndElement, selectionStartElement, startOffset, endOffset };
};
const guardAgainstSelectionTargetIsImage = ({
  selectionStartElement,
  selectionEndElement,
  startOffset,
  endOffset,
}) => {
  const selectionStartIsBeforeImage =
    selectionStartElement.nodeType === Node.ELEMENT_NODE &&
    selectionStartElement.childNodes[startOffset]?.localName === 'img';
  const selectionEndIsBeforeImage =
    selectionEndElement.nodeType === Node.ELEMENT_NODE &&
    selectionEndElement.childNodes[endOffset]?.localName === 'img';

  const selectionStartIsAfterImage =
    selectionStartElement.nodeType === Node.ELEMENT_NODE &&
    selectionStartElement.childNodes[startOffset - 1]?.localName === 'img';
  const selectionEndIsAfterImage =
    selectionEndElement.nodeType === Node.ELEMENT_NODE &&
    selectionEndElement.childNodes[endOffset - 1]?.localName === 'img';
  const startSelectionEqualsEndSelection =
    selectionStartElement === selectionEndElement;
  if (selectionStartIsBeforeImage || selectionStartIsAfterImage) {
    const spanElement = document.createElement('span');
    selectionStartElement.insertBefore(
      spanElement,
      selectionStartElement.childNodes[startOffset],
    );
    selectionStartElement = spanElement;
    startOffset = 0;
  }
  if (selectionEndIsBeforeImage || selectionEndIsAfterImage) {
    if (startSelectionEqualsEndSelection) {
      selectionEndElement = selectionStartElement;
    } else {
      const spanElement = document.createElement('span');
      selectionEndElement.insertBefore(
        spanElement,
        selectionEndElement.childNodes[endOffset],
      );
      selectionEndElement = spanElement;
    }
    endOffset = 0;
  }
  return {
    selectionStartElement,
    selectionEndElement,
    startOffset,
    endOffset,
  };
};

const guardAgainstEditorIsSelectionTarget = ({
  selectionStartElement,
  selectionEndElement,
  startOffset,
  endOffset,
}) => {
  const editor = document.querySelector('#rich-text');
  const editorIsStartSelectionTarget = editor === selectionStartElement;
  const editorIsEndSelectionTarget = editor === selectionEndElement;
  const startSelectionEqualsEndSelection =
    selectionStartElement === selectionEndElement;
  if (editorIsStartSelectionTarget) {
    const spanElement = document.createElement('span');
    editor.insertBefore(spanElement, editor.children[startOffset + 1]);
    selectionStartElement = spanElement;
    startOffset = 0;
  }
  if (editorIsEndSelectionTarget) {
    if (startSelectionEqualsEndSelection) {
      selectionEndElement = selectionStartElement;
    } else {
      const spanElement = document.createElement('span');
      editor.insertBefore(spanElement, editor.children[endOffset + 1]);
      selectionEndElement = spanElement;
    }
    endOffset = 0;
  }
  return {
    selectionStartElement,
    selectionEndElement,
    startOffset,
    endOffset,
  };
};

export {
  guardAgainstSubDDOEIsTextNode,
  guardAgainstDDOETagIsNotNeutral,
  guardAgainstEditorIsDDOE,
  guardAgainstSelectionTargetIsImage,
  guardAgainstEditorIsSelectionTarget,
};
