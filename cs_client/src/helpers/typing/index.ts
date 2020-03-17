import { getDDOE } from '::helpers/execK/steps/pipe1/ddoes';
import { getSelection } from '::helpers/execK/steps/get-selection';
import {
  getTextOfNodesThatStartWithSpace,
  negativeIndent,
} from '::helpers/typing/negative-indent';

const getAllElementsUntilElement = (list, endElement) => {
  const nextSibling = list[list.length - 1].nextElementSibling;
  if (nextSibling !== endElement) {
    list.push(nextSibling);
    getAllElementsUntilElement(list, endElement);
  }
};

const setupKeyboardEvents = () => {
  const editor = document.querySelector('#rich-text');
  editor.onkeydown = e => {
    if (e.keyCode == 9) {
      e.preventDefault();
      const { collapsed, startElement, endElement } = getSelection({
        selectAdjacentWordIfNoneIsSelected: false,
      });
      const startDDOE = getDDOE(startElement);
      const endDDOE = getDDOE(endElement);
      const selectionIsMultiline = !collapsed && startDDOE !== endDDOE;
      const positiveIndent = !e.shiftKey;
      if (selectionIsMultiline) {
        const DDOEs = [startDDOE];
        getAllElementsUntilElement(DDOEs, endDDOE);
        DDOEs.push(endDDOE);
        if (positiveIndent) {
          DDOEs.forEach(ddoe => {
            ddoe.insertAdjacentHTML(
              'afterbegin',
              '<span>\u00A0 \u00A0 </span>',
            );
          });
        } else {
          DDOEs.forEach(ddoe => {
            const nodes = getTextOfNodesThatStartWithSpace(ddoe);
            const str = negativeIndent(nodes);
            if (str) {
              ddoe.insertAdjacentHTML('afterbegin', `<span>${str}</span>`);
            }
          });
        }
      }
    }
  };
};

export { setupKeyboardEvents };

