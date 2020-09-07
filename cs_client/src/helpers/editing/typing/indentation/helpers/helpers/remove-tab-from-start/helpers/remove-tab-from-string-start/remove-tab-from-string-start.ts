export const removeTabFromStringStart = (texts: string[]): string => {
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
