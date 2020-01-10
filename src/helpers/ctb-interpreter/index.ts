import { translateAttributesToHtmlAndCss } from './steps/translate-attributes-to-html-and-css';
import { flattenIntoLines } from './steps/flatten-into-lines';
import { groupNodesByLine } from './steps/group-nodes-by-line';
import { insertOtherTables } from './steps/insert-other-tables';
import { parseXml } from './helpers/helpers';
import { compose } from 'ramda';
import { fixCharacters } from './steps/fix-characters';

const processingPipe = compose(
  fixCharacters.replaceSpaceCharacter,
  fixCharacters.replaceSpaceCharacter,
  JSON.stringify,
  groupNodesByLine,
  flattenIntoLines,
  translateAttributesToHtmlAndCss,
);
const parseRichText = async ({ nodeTableXml, otherTables = {} }) => {
  const temp = fixCharacters.flagGhostNewLines(nodeTableXml);
  const parsedXml = await parseXml({ xml: temp });
  // @ts-ignore
  const richText = parsedXml.node.rich_text;
  const withNewLines = fixCharacters.fillGhostNewLines(richText);
  return processingPipe(insertOtherTables({ xml: withNewLines, otherTables }));
};

export { parseRichText };
