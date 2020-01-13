import { translateAttributesToHtmlAndCss } from './steps/translate-attributes-to-html-and-css';
import { flattenIntoLines } from './steps/flatten-into-lines';
import { groupNodesByLine } from './steps/group-nodes-by-line';
import { insertOtherTables } from './steps/insert-other-tables';
import { parseXml } from '../helpers';
import { compose } from 'ramda';
import { fixCharacters } from './steps/fix-characters';

const tap = label => val => (console.log(label, val), val);

const processingPipe = otherTables =>
  compose(
    fixCharacters.replaceTabCharacter,
    fixCharacters.replaceSpaceCharacter,
    JSON.stringify,
    tap('two'),
    groupNodesByLine,
    tap('one'),
    flattenIntoLines,
    translateAttributesToHtmlAndCss,
    // @ts-ignore
    insertOtherTables(otherTables),
    fixCharacters.fillGhostNewLines
  );
const parseRichText = async ({ nodeTableXml, otherTables = {} }) => {
  nodeTableXml = fixCharacters.flagGhostNewLines(nodeTableXml);
  let richText = await parseXml({ xml: nodeTableXml }).then(
    ({ node: { rich_text } }) => rich_text
  );
  return processingPipe(otherTables)(richText);
};

export { parseRichText, processingPipe };
