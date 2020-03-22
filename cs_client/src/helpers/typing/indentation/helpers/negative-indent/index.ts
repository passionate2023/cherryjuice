import { getInnerText } from '::helpers/execK/helpers';

const negativeIndent = (texts: string[]): string => {
  const str = texts
    .join('')
    .replace(/\u00A0/g, ' ')
    .replace(/\t/g, '    ');
  const regex = /^([\s]+)([^\s]*)/.exec(str);
  if (regex) {
    const spaces = regex[1];
    const remainingStr = str.replace(spaces, '');

    const newSpaces = spaces.replace(/ {1,4}/, '');

    return (newSpaces + remainingStr || '')
      .replace(/ {2}/g, '\u00A0 ')
      .replace(/\t/g, '\u00A0 \u00A0 ');
  } else return str;
};

const deleteSubDDOEsThatStartWithSpaceAndGetTheirText = (
  ddoe: Element,
  {
    deleteFirstSubDDOEThatHasWords,
  }: { deleteFirstSubDDOEThatHasWords: boolean },
): {
  textOfNodes: string[];
  firstSubDDOEThatISNotFullOfSpaces: Element;
  firstSubDDOEStartsWithSpace: boolean;
} => {
  const textOfNodes = [];
  let firstSubDDOEThatISNotFullOfSpaces;
  let firstSubDDOEStartsWithSpace = false;
  let firstSubDDOEThatHasNoText;
  Array.from(ddoe.childNodes).forEach((subDDOE, i) => {
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

export { negativeIndent, deleteSubDDOEsThatStartWithSpaceAndGetTheirText };
