const getDDOE = el =>
  el.parentElement.getAttribute('id') === 'rich-text'
    ? el
    : getDDOE(el.parentElement);
const getSubDDOE = el =>
  el.parentElement.parentElement.getAttribute('id') === 'rich-text'
    ? el
    : getSubDDOE(el.parentElement);

const getSelectedDDOEs = ({ startDDOE, endDDOE }) => {
  const editorDiv = document.querySelector('#rich-text');
  const allDDOEs = Array.from(editorDiv.childNodes);
  const startDDOEIndex = allDDOEs.indexOf(startDDOE);
  const endDDOEIndex = allDDOEs.indexOf(endDDOE);
  const selectedDDOEs = allDDOEs.slice(startDDOEIndex, endDDOEIndex + 1);
  return { selectedDDOEs };
};

const getIndexOfSelectionSubDDOEs = ({
  startDDOE,
  endDDOE,
  selectionStartElement,
  selectionEndElement
}) => {
  const indexOfStartSubDDOE = Array.from(startDDOE.childNodes).findIndex(
    child => getSubDDOE(selectionStartElement) === child
  );

  const indexOfEndSubDDOE = Array.from(endDDOE.childNodes).findIndex(
    child => getSubDDOE(selectionEndElement) === child
  );
  return { indexOfStartSubDDOE, indexOfEndSubDDOE };
};

const getIsolatedDDOESelection = ({
  indexOfStartSubDDOE,
  indexOfEndSubDDOE,
  selectedDDOEs
}) => {
  const isolatedSelection = [];
  selectedDDOEs.forEach((DDOE, DDOEIndex) => {
    const clone = DDOE.cloneNode();
    Array.from(DDOE.childNodes).forEach((child: Element | Text, childIndex) => {
      const unrelatedChild =
        (DDOEIndex === 0 && childIndex < indexOfStartSubDDOE) ||
        (DDOEIndex === selectedDDOEs.length - 1 &&
          childIndex > indexOfEndSubDDOE);
      if (!unrelatedChild) {
        clone.innerHTML +=
          // @ts-ignore
          child.nodeType === Node.TEXT_NODE ? child.wholeText : child.outerHTML;
      }
    });
    isolatedSelection.push(clone);
  });
  return { isolatedSelection };
};

const deletedIsolatedSelection = ({
  indexOfStartSubDDOE,
  indexOfEndSubDDOE,
  selectedDDOEs
}) => {
  let startAnchor, endAnchor;
  selectedDDOEs.forEach((DDOE: Element, DDOEIndex) => {
    Array.from(DDOE.childNodes).forEach((child: Node, childIndex) => {
      const unrelatedChild =
        (DDOEIndex === 0 && childIndex < indexOfStartSubDDOE) ||
        (DDOEIndex === selectedDDOEs.length - 1 &&
          childIndex > indexOfEndSubDDOE);
      if (unrelatedChild) return undefined;
      const deletedSelectionStart =
        !startAnchor && DDOEIndex === 0 && childIndex === indexOfStartSubDDOE;
      const deletedSelectionEnd =
        !endAnchor &&
        DDOEIndex === selectedDDOEs.length - 1 &&
        childIndex === indexOfEndSubDDOE;
      if (deletedSelectionStart) {
        startAnchor = document.createElement('span');
        startAnchor.setAttribute('id', 'start-anchor');
        child.parentElement.insertBefore(startAnchor, child);
      }
      if (deletedSelectionEnd) {
        endAnchor = document.createElement('span');
        endAnchor.setAttribute('id', 'end-anchor');
        child.parentElement.insertBefore(endAnchor, child);
      }
      child.parentElement.removeChild(child);
    });
    if (DDOE.childNodes.length === 0) DDOE.parentElement.removeChild(DDOE);
  });
  return { startAnchor, endAnchor };
};
const guardAgainstSubDDOEIsTextNode = ({
  selectionStartElement,
  selectionEndElement,
  startDDOE,
  endDDOE
}) => {
  const subStartSubDDOEIsTextNode =
    startDDOE === selectionStartElement.parentElement &&
    selectionStartElement.nodeType === 3;
  const subEndSubDDOEIsTextNode =
    endDDOE === selectionEndElement.parentElement &&
    selectionEndElement.nodeType === 3;
  const startSelectionEqualsEndSelection =
    selectionStartElement === selectionEndElement;

  if (subStartSubDDOEIsTextNode) {
    const spanElement = document.createElement('span');
    spanElement.innerHTML = selectionStartElement.wholeText;
    selectionStartElement.parentElement.replaceChild(
      spanElement,
      selectionStartElement
    );
    selectionStartElement = spanElement;
  } else selectionStartElement = selectionStartElement.parentElement;
  if (subEndSubDDOEIsTextNode) {
    if (startSelectionEqualsEndSelection) {
      selectionEndElement = selectionStartElement;
    } else {
      const spanElement = document.createElement('span');
      spanElement.innerHTML = selectionEndElement.wholeText;
      selectionEndElement.parentElement.replaceChild(
        spanElement,
        selectionEndElement
      );
      selectionEndElement = spanElement;
    }
  } else selectionEndElement = selectionEndElement.parentElement;
  return { selectionStartElement, selectionEndElement };
};

export {
  guardAgainstSubDDOEIsTextNode,
  getDDOE,
  getSelectedDDOEs,
  getIndexOfSelectionSubDDOEs,
  getIsolatedDDOESelection,
  deletedIsolatedSelection
};
