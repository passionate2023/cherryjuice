import { getLastArrElm, newLineCharacter } from './helpers/helpers';

const separator = parsedXml => {
  const res = parsedXml.reduce((acc, val, i) => {
    const text = typeof val === 'string' ? val : val._;
    if (text.includes(newLineCharacter) && text.length > 1) {
      const parts = text
        .split('\n')
        .map((part, i, arr) =>
          part.length === 0 && i !== arr.length - 1 ? '\n' : part
        )
        .filter(str => str.length > 0);
      if (typeof val === 'object') {
        const i = parts.findIndex(value => value !== newLineCharacter);
        parts.splice(i, 1, { ...val, _: parts[i] });
      }
      acc.push(...parts);
    } else acc.push(val);
    return acc;
  }, []);
  return res;
};
export { separator };
