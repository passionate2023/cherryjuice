import { extractOtherTables } from './helpers/tables';
import { objToXml } from '../../../../../xml';
import { AHtmlNode } from '../../../../query/ahtml-to-html';

type PreCTB = { otherTables: any; xmlString: string };
const midPipeToCtb = (nodes: AHtmlNode[]): PreCTB => {
  const { nodes: rich_text, otherTables } = extractOtherTables(nodes);
  return {
    xmlString: objToXml({
      xmlObject: {
        node: {
          rich_text,
        },
      },
    }),
    otherTables,
  };
};
export { midPipeToCtb };
