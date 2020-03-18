import { getDDOE } from '::helpers/execK/steps/pipe1/ddoes';
import { getSelection } from '::helpers/execK/steps/get-selection';
import {
  deleteSubDDOEsThatStartWithSpaceAndGetTheirText,
  negativeIndent,
} from '::helpers/typing/negative-indent';
import { getDeepestFirstChild } from '::helpers/execK/steps/restore-selection';
import { getInnerText } from '::helpers/execK/helpers';

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
            const deepestFirstChild = getDeepestFirstChild(ddoe);
            if (deepestFirstChild.insertData)
              deepestFirstChild.insertData(0, '\u00A0 \u00A0 ');
            else {
              deepestFirstChild.insertAdjacentHTML(
                'beforebegin',
                '<span>\u00A0 \u00A0 </span>',
              );
            }
          });
        } else {
          DDOEs.forEach(ddoe => {
            const {
              textOfNodes,
              firstSubDDOEThatISNotFullOfSpaces,
              firstSubDDOEStartsWithSpace,
            } = deleteSubDDOEsThatStartWithSpaceAndGetTheirText(ddoe, {
              deleteFirstSubDDOEThatHasWords: false,
            });
            const str = negativeIndent(textOfNodes);
            if (firstSubDDOEThatISNotFullOfSpaces) {
              const deepestFirstChild = getDeepestFirstChild(
                firstSubDDOEThatISNotFullOfSpaces,
              );
              if (firstSubDDOEStartsWithSpace)
                deepestFirstChild.replaceData(
                  0,
                  deepestFirstChild.wholeText.length,
                  str,
                );
              else deepestFirstChild.insertData(0, str);
            } else if (str) {
              const deepestFirstChild = getDeepestFirstChild(ddoe);
              deepestFirstChild.insertAdjacentHTML(
                'beforebegin',
                `<span>${str}</span`,
              );
            }

          });
        }
      }
    }
  };
};

export { setupKeyboardEvents };
