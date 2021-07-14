import { extractObjects } from './helpers/tables';
import { AHtmlNode,objToXml } from '@cherryjuice/ctb-to-ahtml';

type PreCTB = { objects: any; xmlString: string };
const separateXmlAndObjects = (nodes: AHtmlNode[]): PreCTB => {
  const { nodes: rich_text, otherTables: objects } = extractObjects(nodes);
  return {
    xmlString: objToXml({
      xmlObject: {
        node: {
          rich_text,
        },
      },
    }),
    objects,
  };
};
export { separateXmlAndObjects };
