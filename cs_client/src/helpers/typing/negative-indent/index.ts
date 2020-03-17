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

    const newSpaces = spaces
      .replace(/ {1,4}/, '')
      .replace(/ {2}/g, '\u00A0 ')
      .replace(/\t/g, '\u00A0 \u00A0 ');
    return newSpaces + remainingStr || '';
  } else return str;
};

const getTextOfNodesThatStartWithSpace = (ddoe: Element): string[] => {
  const res = [];
  let foundFirstNonSpaceSubDDOE = false;
  Array.from(ddoe.childNodes).forEach(subDDOE => {
    if (foundFirstNonSpaceSubDDOE) return;
    const text = getInnerText(subDDOE);
    const textStartsWithSpace = /^[\s]/.test(text);
    if (textStartsWithSpace) {
      res.push(text);
      subDDOE.remove();
    } else {
      foundFirstNonSpaceSubDDOE = true;
    }
  });
  return res;
};

export { negativeIndent, getTextOfNodesThatStartWithSpace };
