import { translateAttributesToHtmlAndCss } from './steps/translate-attributes-to-html-and-css';

import { flattenIntoLines } from './steps/flatten-into-lines';
import { groupNodesByLine } from './steps/group-nodes-by-line';
import { insertOtherTables } from './steps/insert-other-tables';
import { parseXml } from './helpers/helpers';

const flagGhostLines = xmlString =>
  xmlString.replace(/>(\s*\n\s*<\/rich_text>)/g, ' containsNewLine="true" >$1');

const replaceTabCharacter = xmlString =>
  xmlString.replace(/\t/g, '\u00A0 \u00A0 ');
const replaceSpaceCharacter = xmlString =>
  xmlString.replace(/ {2}/g, '\u00A0 ');
//'&nbsp;&nbsp;&nbsp;&nbsp;'); //<rich_text tab="true">_</rich_text>');
const applyFixes = xml =>
  xml.map(node => {
    if (typeof node === 'object') {
      if (node.$.containsNewLine) {
        node._ = '\n';
        delete node.$.containsNewLine;
      }
      // if (node._) {
      //   console.log('replacing tab character');
      //   node._ = replaceTabCharacter(node._);
      //   node._ = replaceSpaceCharacter(node._);
      //   console.log(node._);
      // }
    }
    // else {
    //   node = replaceTabCharacter(node);
    //   node = replaceSpaceCharacter(node);
    // }

    return node;
  });

const parseRichText = async ({
  nodeTableXml,
  otherTables = {},
  meta: { name },
  options: { stringify },
}) => {
  // const temp1 = replaceTabCharacter(nodeTableXml);
  // console.log({temp1})
  nodeTableXml = replaceSpaceCharacter(replaceTabCharacter(nodeTableXml));
  const temp = flagGhostLines(nodeTableXml);
  // console.log({ temp });
  const parsedXml = await parseXml({ xml: temp });
  // @ts-ignore
  const richText = parsedXml.node.rich_text;

  // console.log('pre insert-other-tables', JSON.stringify(richText));
  const withNewLines = applyFixes(richText);
  const xml = insertOtherTables({ xml: withNewLines, otherTables });
  // console.log('pre css-html translator', xml);
  const translated = xml.map(node => {
    // edgecase where richtext
    if (typeof node === 'object') {
      // if (node.$.containsNewLine) {
      //   node._ = '\n';
      //   delete node.$.containsNewLine;
      //   console.log('replaced node', node);
      // }
      node.$$ = translateAttributesToHtmlAndCss(node.$);
    }
    return node;
  });

  // const replacedTabs = insertTab({ parsedXml: translated });
  // console.log('pre separation', replacedTabs);
  const separated = flattenIntoLines(translated);
  // console.log('pre splitting', separated);
  const split = groupNodesByLine(separated);
  // console.log('pre resolving', split);
  return stringify ? JSON.stringify(split) : split;
};
export { parseRichText };
