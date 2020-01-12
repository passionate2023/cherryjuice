import { processingPipe } from '../pipe';
import { renderingBus } from './__data__';
import { fixCharacters } from '../steps/fix-characters';
import { parseString } from 'xml2js';
import { insertOtherTables } from '../steps/insert-other-tables';

describe('rendering bugs', () => {
  test('bug 1 - full', () => {
    let nodeTableXml = renderingBus.bug1_offset_images.txt;
    nodeTableXml = fixCharacters.flagGhostNewLines(nodeTableXml);
    parseString(nodeTableXml, function(err, result) {
      let richText = result.node.rich_text;
      const res = processingPipe(renderingBus.bug1_offset_images.otherTables)(
        richText,
      );
      console.log(res);
      expect(JSON.parse(res)).toEqual(
        renderingBus.bug1_offset_images.expected.full,
      );
    });
  });
});
