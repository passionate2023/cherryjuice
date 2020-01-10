import { translateAttributesToHtmlAndCss } from './steps/translate-attributes-to-html-and-css';
import { flattenIntoLines } from './steps/flatten-into-lines';
import { groupNodesByLine } from './steps/group-nodes-by-line';
import { insertOtherTables } from './steps/insert-other-tables';
import { parseXml } from './helpers/helpers';
import { compose } from 'ramda';
import { fixCharacters } from './steps/fix-characters';

const processingPipe = compose(
  fixCharacters.replaceTabCharacter,
  fixCharacters.replaceSpaceCharacter,
  JSON.stringify,
  groupNodesByLine,
  flattenIntoLines,
  translateAttributesToHtmlAndCss,
  // @ts-ignore
  fixCharacters.fillGhostNewLines
);
const parseRichText = async ({ nodeTableXml, otherTables = {} }) => {
  nodeTableXml = fixCharacters.flagGhostNewLines(nodeTableXml);
  let richText = await parseXml({ xml: nodeTableXml }).then(
    ({ node: { rich_text } }) => rich_text
  );
  richText = insertOtherTables({ xml: richText, otherTables });
  return processingPipe(richText);
};

export { parseRichText };
