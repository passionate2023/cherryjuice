const newLineCharacter = '\n';
const getLastArrElm = arr => arr[arr.length - 1];
const groupNodesByLine = parsedXml => {
  parsedXml.reduce((acc, val, i, arr) => {}, []);
  const res = parsedXml.reduce(
    (acc, val, i, arr) => {
      // console.log(i);
      const text = typeof val === 'string' ? val : val._ || '';
      if (!val.type && text.includes(newLineCharacter)) {
        acc.push([]);
        if (text.length > 1) {
          // console.log('before', parsedXml.length);
          arr.push(text.substr(1));
          getLastArrElm(acc).push(val);
          // console.log('after', parsedXml.length);
        }
      } else {
        getLastArrElm(acc).push(val);
      }
      return acc;
    },
    [[]]
  );
  return res;
};
export { groupNodesByLine };
