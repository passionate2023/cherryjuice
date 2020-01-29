import { translateAttributesToHtmlAndCss } from './steps/translate-attributes-to-html-and-css';
import { flattenIntoLines } from './steps/flatten-into-lines';
import { groupNodesByLine } from './steps/group-nodes-by-line';
import { insertOtherTables } from './steps/insert-other-tables';
import { parseXml } from './helpers';
import { compose } from 'ramda';
import { fixCharacters } from './steps/fix-characters';
import { escapeHtml } from './helpers/escape-html';

const tap = label => val => (console.log(label, val), val);
const stringifierPipe = compose(
  fixCharacters.replaceTabCharacter,
  fixCharacters.replaceSpaceCharacter,
  JSON.stringify,
);
const processingPipe = otherTables =>
  compose(
    tap('two'),
    translateAttributesToHtmlAndCss,
    groupNodesByLine,
    flattenIntoLines,
    insertOtherTables(otherTables),
    fixCharacters.restoreOrphanWhiteSpace,
  );
const parseRichText = async ({
  nodeTableXml,
  otherTables = {},
  stringify = true,
}) => {
  nodeTableXml = fixCharacters.flagOrphanWhiteSpace(nodeTableXml);
  let richText = await parseXml({ xml: nodeTableXml }).then(
    ({ node: { rich_text } }) => rich_text,
  );
  const res = processingPipe(otherTables)(richText);
  return stringify ? stringifierPipe(res) : res;
};

export { parseRichText, processingPipe };
