import { getLastArrElm, newLineCharacter } from '../../helpers';

const flattenIntoLines = xml => {
  // const logs = [];
  console.log({ xml });
  const res = xml.reduce((acc, val, i) => {
    const text = typeof val === 'string' ? val : val._;
    // let log = { text, parts: undefined, pushed: undefined };
    if (
      !val.type &&
      text &&
      text.includes(newLineCharacter) &&
      text.length > 1
    ) {
      let parts = (Array.from(text) as string[])
        .reduce(
          (acc, val) => {
            const str = acc[acc.length - 1];
            if (val !== newLineCharacter) {
              acc[acc.length - 1] = str + val;
            } else {
              acc.push(val, '');
            }
            return acc;
          },
          ['']
        )
        .filter(part => part);

      // log.parts = parts;

      if (typeof val === 'object') {
        // const i = parts.findIndex(value => value !== newLineCharacter);
        parts = parts.map(part => ({ ...val, _: part }));
      }
      // log.pushed = parts;
      // logs.push(log);
      acc.push(...parts);
    } else acc.push(val);
    return acc;
  }, []);
  // console.log({ res });
  // console.log(logs);
  return res;
};
export { flattenIntoLines };
