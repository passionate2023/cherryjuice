import { midPipeToCtb } from '../index';
import { Builder } from 'xml2js';
import { sample_01, sample_02 } from './__data__';

const builder = new Builder({
  renderOpts: { pretty: false, indent: '', newline: '' },
  headless: true,
});
// const testObjects = ({ midPipe, ctbXmlString, name }) => {
//   test(`test parsed xml object - ${name}`, async () => {
//     const { xmlObject } = midPipeToCtb(midPipe);
//     const ogXmlObject = await parseXml({ xml: ctbXmlString });
//     expect(xmlObject).toEqual(ogXmlObject);
//   });
// };
const testXmlString = ({ midPipe, ctbXmlString, name }) => {
  test(`test xml string - ${name}`, async () => {
    const { xmlString, otherTables } = midPipeToCtb(midPipe);
    // writeEffect('node_xml')(xmlString);
    // writeEffect('table_xml')(otherTables);
    expect(xmlString).toEqual(ctbXmlString);
  });
};
describe.skip('midPipeToPseudoCtb - compare xml string', () => {
  testXmlString(sample_02);
});