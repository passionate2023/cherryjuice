import { processingPipe } from '../pipe';
import { renderingBus } from './__data__';
import { fixCharacters } from '../steps/fix-characters';
import { parseString } from 'xml2js';

const renderingTestTemplate = ({ nodeTableXml, otherTables, expected }) => {
  nodeTableXml = fixCharacters.flagOrphanWhiteSpace(nodeTableXml);

  parseString(nodeTableXml, function(err, result) {
    let richText = result.node.rich_text;
    const res = processingPipe(otherTables)(richText);
    console.log(JSON.stringify(res));
    expect(JSON.parse(res)).toEqual(expected);
  });
};

describe('rendering bugs', () => {
  test('bug 1 - full', () => {
    renderingTestTemplate({
      nodeTableXml: renderingBus.bug1_offset_images.txt,
      otherTables: renderingBus.bug1_offset_images.otherTables,
      expected: renderingBus.bug1_offset_images.expected.full
    });
  });
  test('bug 2 - full', () => {
    renderingTestTemplate({
      nodeTableXml: renderingBus.bug2_empty_newline_ignred.txt,
      otherTables: renderingBus.bug2_empty_newline_ignred.otherTables,
      expected: renderingBus.bug2_empty_newline_ignred.expected.full
    });
  });
  test('bug 3 - full', () => {
    renderingTestTemplate({
      nodeTableXml: renderingBus.issue3_monospace_not_fully_applied.txt,
      otherTables: renderingBus.issue3_monospace_not_fully_applied.otherTables,
      expected: renderingBus.issue3_monospace_not_fully_applied.expected.full
    });
  });
  test('issue 4 - full', () => {
    renderingTestTemplate({
      nodeTableXml: renderingBus.issue4_offset_images.txt,
      otherTables: renderingBus.issue4_offset_images.otherTables,
      expected: renderingBus.issue4_offset_images.expected.full
    });
  });
});
