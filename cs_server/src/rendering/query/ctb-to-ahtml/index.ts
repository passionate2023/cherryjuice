import { translateAttributesToHtmlAndCss } from './steps/translate-attributes-to-html-and-css';
import { flattenIntoLines } from './steps/flatten-into-lines';
import { groupNodesByLine } from './steps/group-nodes-by-line';
import { insertOtherTables } from './steps/insert-other-tables';
import { compose } from 'ramda';
import { fixCharacters } from './steps/fix-characters';
import {  tap } from '../../../helpers/debug';
import { parseXml } from '../../../helpers/xml';

// const stringifierPipe = compose(
//   fixCharacters.replaceTabCharacter,
//   fixCharacters.replaceSpaceCharacter,
//   JSON.stringify,
// );
const processingPipe = otherTables =>
  compose(
    translateAttributesToHtmlAndCss,
    groupNodesByLine,
    tap('inside-the-pipe'),
    flattenIntoLines,
    insertOtherTables(otherTables),
    fixCharacters.restoreOrphanWhiteSpace,
  );
const ctbToAHtml = async ({
  nodeTableXml,
  otherTables = {},
  stringify = true,
}) => {
  nodeTableXml = fixCharacters.flagOrphanWhiteSpace(nodeTableXml);
  let richText = await parseXml({ xml: nodeTableXml }).then(
    ({ node: { rich_text } }) => rich_text,
  );
  // const res = processingPipe(otherTables)(richText);
  // return stringify ? stringifierPipe(res) : res;
  return processingPipe(otherTables)(richText);
};

export { ctbToAHtml, processingPipe };
