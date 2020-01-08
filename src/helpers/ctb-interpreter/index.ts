import { translateAttributesToHtmlAndCss } from './steps/translate-attributes-to-html-and-css';

import { flattenIntoLines } from './steps/flatten-into-lines';
import { groupNodesByLine } from './steps/group-nodes-by-line';
import { insertOtherTables } from './steps/insert-other-tables';
import { parseXml } from './helpers/helpers';

const parseRichText = async ({
  nodeTableXml,
  otherTables = {},
  meta: { name },
  options: { stringify }
}) => {
  const parsedXml = await parseXml({ xml: nodeTableXml });
  // @ts-ignore
  const richText = parsedXml.node.rich_text;
  console.log('pre insert-other-tables', richText);
  const xml = insertOtherTables({ xml: richText, otherTables });
  console.log('pre css-html translator', xml);
  const translated = xml.map(node => {
    if (typeof node === 'object') {
      node.$$ = translateAttributesToHtmlAndCss(node.$);
    }
    return node;
  });
  console.log('pre separation', translated);
  const separated = flattenIntoLines(translated);
  console.log('pre splitting', separated);
  const split = groupNodesByLine(separated);
  console.log('pre resolving', split);
  return stringify ? JSON.stringify(split) : split;
};
export { parseRichText };
