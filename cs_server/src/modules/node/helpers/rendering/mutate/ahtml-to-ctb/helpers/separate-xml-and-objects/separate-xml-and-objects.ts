import { extractObjects } from './helpers/tables';
import { objToXml } from '../../../../../xml';
import { AHtmlNode } from '../../../../query/ahtml-to-html';

type PreCTB = { objects: any; xmlString: string };
const separateXmlAndObjects = (node_id: number) => (
  nodes: AHtmlNode[],
): PreCTB => {
  const { nodes: rich_text, otherTables: objects } = extractObjects(
    nodes,
    node_id,
  );
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
