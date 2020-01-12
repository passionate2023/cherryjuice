import { parseString } from 'xml2js';
const newLineCharacter = '\n';
const getLastArrElm = arr => arr[arr.length - 1];

const parseXml = ({ xml })  =>
  new Promise((resolve, reject) => {
    parseString(xml, async function(err, result) {
      err ? reject(err) : resolve(result);
    });
  });
export { newLineCharacter, getLastArrElm, parseXml };
