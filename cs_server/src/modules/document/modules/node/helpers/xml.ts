import { Builder, parseString } from 'xml2js';

const builder = new Builder({
  renderOpts: { pretty: false, indent: '', newline: '' },
  headless: true,
});
const objToXml = ({ xmlObject }) =>
  '<?xml version="1.0" ?>' + builder.buildObject(xmlObject);

const parseXml = ({ xml }) =>
  new Promise((resolve, reject) => {
    parseString(xml, async function(err, result) {
      err ? reject(err) : resolve(result);
    });
  });
export { parseXml, objToXml };
