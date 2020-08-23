export const keyEventToValidShortcut = (data: string) => {
  const isWord = /^[a-z]$/.test(data.toLowerCase());
  if (isWord) return data;

  const isSpace = ' ' === data;
  if (isSpace) return data;

  const isDigit = /[0-9]/.test(data);
  if (isDigit) return data;

  const isArrowKey = /Arrow.{2,5}/.test(data);
  if (isArrowKey) return data;

  return '';
};
