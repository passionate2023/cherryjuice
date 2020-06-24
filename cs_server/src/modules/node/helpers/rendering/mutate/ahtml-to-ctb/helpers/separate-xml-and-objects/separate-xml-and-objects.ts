import { extractObjects } from './helpers/tables';
import { objToXml } from '../../../../../xml';
import { AHtmlNode } from '../../../../query/ahtml-to-html';

type PreCTB = { otherTables: any; xmlString: string };
const separateXmlAndObjects = (nodes: AHtmlNode[]): PreCTB => {
  const { nodes: rich_text, otherTables } = extractObjects(nodes);
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
export { separateXmlAndObjects };
