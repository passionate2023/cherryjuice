import { getLastArrElm, newLineCharacter } from './helpers/helpers';

const separator = parsedXml => {
  const res = parsedXml.reduce((acc, val, i) => {
    const text = typeof val === 'string' ? val : val._;
    if (text && text.includes(newLineCharacter) && text.length > 1) {
      // const parts = text
      //   .split('\n')
      //   .map((part, i, arr) => {
      //     return part.length === 0 ? '\n' : part;
      //   })
      //   .filter(str => str.length > 0);
      const parts = text
        .split('\n')
        .reduce((acc, val, i, arr) => {
          acc.push(val.length === 0 ? '\n' : val);
          // if \n is in the middle of two strings, insert \n in the accumulated array
          if (
            val.length &&
            val !== newLineCharacter &&
            arr[i + 1] &&
            arr[i + 1].length &&
            arr[i + 1] !== newLineCharacter
          ) {
            acc.push(newLineCharacter);
            console.log('inserting nwl', `[${val}], i:${i}, arr:${arr}`);
          }
          return acc;
        }, [])
        .filter(str => str.length > 0);
      //deal with the case where the text is all newline characters
      if (parts.every(part => part === newLineCharacter)) parts.pop();
      console.log('parts', parts);
      // if the text has styles, assign the styles to the first non-newline text
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
