import { translateAttributesToHtmlAndCss } from './steps/translate-attributes-to-html-and-css';
import { flattenIntoLines } from './steps/flatten-into-lines';
import { groupNodesByLine } from './steps/group-nodes-by-line';
import { insertOtherTables } from './steps/insert-other-tables';
import { compose } from 'ramda';
import { parseXml } from './steps/parse-xml';
import { AHtmlLine } from '@cherryjuice/ahtml-to-html';

const processingPipe: (otherTables) => (txtTable) => any[] = otherTables =>
  compose(
    translateAttributesToHtmlAndCss,
    groupNodesByLine,
    flattenIntoLines,
    insertOtherTables(otherTables),
  );

const ctbToAHtml = async ({
  nodeTableXml,
  otherTables = {},
}): Promise<AHtmlLine[]> => {
  const json = await parseXml(nodeTableXml);
  return processingPipe(otherTables)(json);
};

export { ctbToAHtml, processingPipe };
