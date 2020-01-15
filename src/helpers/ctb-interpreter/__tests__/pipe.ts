import { processingPipe } from '../pipe';
import { renderingBus } from './__data__';
import { fixCharacters } from '../steps/fix-characters';
import { parseString } from 'xml2js';

const renderingTestTemplate = ({ nodeTableXml, otherTables, expected }) => {
  nodeTableXml = fixCharacters.flagOrphanWhiteSpace(nodeTableXml);

  parseString(nodeTableXml, function(err, result) {
    let richText = result.node.rich_text;
    const res = processingPipe(otherTables)(richText);
    console.log(res);
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
  test('issue 5 - full', () => {
    renderingTestTemplate({
      nodeTableXml:
        renderingBus.issue5_offset_images_and_tables_and_code_box.txt,
      otherTables:
        renderingBus.issue5_offset_images_and_tables_and_code_box.otherTables,
      expected:
        renderingBus.issue5_offset_images_and_tables_and_code_box.expected.full
    });
  });
  test('issue 6 - full', () => {
    renderingTestTemplate({
      nodeTableXml: renderingBus.issue6.txt,
      otherTables: renderingBus.issue6.otherTables,
      expected: renderingBus.issue6.expected.full
    });
  });
  test('issue 7 - full', () => {
    renderingTestTemplate({
      nodeTableXml: renderingBus.issue7.txt,
      otherTables: renderingBus.issue7.otherTables,
      expected: renderingBus.issue7.expected.full
    });
  });
});
