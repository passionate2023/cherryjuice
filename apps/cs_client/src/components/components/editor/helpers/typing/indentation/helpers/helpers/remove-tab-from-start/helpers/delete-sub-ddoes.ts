import { getInnerText } from '::root/components/editor/helpers/execK/helpers';

type Params = {
  textOfNodes: string[];
  firstSubDDOEThatISNotFullOfSpaces: Element;
  firstSubDDOEStartsWithSpace: boolean;
};
const deleteSubDDOEsThatStartWithSpaceAndGetTheirText = (
  ddoe: Element,
  {
    deleteFirstSubDDOEThatHasWords,
  }: { deleteFirstSubDDOEThatHasWords: boolean },
): Params => {
  const textOfNodes = [];
  let firstSubDDOEThatISNotFullOfSpaces;
  let firstSubDDOEStartsWithSpace = false;
  let firstSubDDOEThatHasNoText;
  Array.from(ddoe.childNodes).forEach(subDDOE => {
    if (!firstSubDDOEThatISNotFullOfSpaces && !firstSubDDOEThatHasNoText) {
      const text = getInnerText(subDDOE);
      if (!text) {
        firstSubDDOEThatHasNoText = subDDOE;
      } else {
        const textStartsWithSpace = /^[\s]/.test(text);
        const textHasWords = /[^\s]+/.test(text);
        if (textStartsWithSpace) {
          textOfNodes.push(text);
        }
        if (textHasWords) {
          firstSubDDOEThatISNotFullOfSpaces = subDDOE;
          firstSubDDOEStartsWithSpace = textStartsWithSpace;
        }
        if (textStartsWithSpace) {
          if (!textHasWords || deleteFirstSubDDOEThatHasWords) subDDOE.remove();
        }
      }
    }
  });
  return {
    textOfNodes,
    firstSubDDOEThatISNotFullOfSpaces,
    firstSubDDOEStartsWithSpace,
  };
};

export { deleteSubDDOEsThatStartWithSpaceAndGetTheirText };
