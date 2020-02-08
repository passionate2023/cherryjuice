import { Builder } from 'xml2js';
const builder = new Builder({
  renderOpts: { pretty: false, indent: '', newline: '' },
  headless: true,
});
const objToXml = ({ xmlObject }) =>
  '<?xml version="1.0" ?>' + builder.buildObject(xmlObject);

export {objToXml}