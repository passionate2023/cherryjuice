import { extractObjects } from './helpers/tables';
import { objToXml } from '../../../../../../node/helpers/xml';
import { AHtmlNode } from '../../../../../../node/helpers/rendering/ahtml-to-html';

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
