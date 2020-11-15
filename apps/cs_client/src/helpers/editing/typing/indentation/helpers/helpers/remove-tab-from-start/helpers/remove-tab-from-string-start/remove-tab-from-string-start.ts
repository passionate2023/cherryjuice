import { DOUBLE_SPACE, QUAD_SPACE, SPACE } from '@cherryjuice/ahtml-to-html';

export const removeTabFromStringStart = (texts: string[]): string => {
  const str = texts
    .join('')
    .replace(/\u00A0/g, SPACE)
    .replace(/\t/g, SPACE + SPACE + SPACE + SPACE);
  const regex = /^([\s]+)([^\s]*)/.exec(str);
  if (regex) {
    const spaces = regex[1];
    const remainingStr = str.replace(spaces, '');

    const newSpaces = spaces.replace(/ {1,4}/, '');

    return (newSpaces + remainingStr || '')
      .replace(/ {2}/g, DOUBLE_SPACE)
      .replace(/\t/g, QUAD_SPACE);
  } else return str;
};
