import { adaptNodeStyle } from '../../helpers/adapt-node-meta';
import { ExportCTB } from '../../export-ctb';
import { NodeFromPG } from '../../helpers/ahtml-to-ctb/helpers/translate-ahtml/__tests__/__data__/ahtml-xml-samples/02';

const assertNodeMeta = async (exportCtb: ExportCTB, nodes: NodeFromPG[]) => {
  const writtenNodes = await exportCtb.getDb.all(
    'select n.node_id, n.is_ro, n.is_richtxt, c.node_id as cnode_id from node as n INNER JOIN children as c on n.node_id = c.node_id',
  );
  expect(writtenNodes.sort((a, b) => a.node_id - b.node_id)).toEqual(
    nodes
      .map(({ node_id, node_title_styles }) => ({
        node_id,
        cnode_id: node_id,
        ...adaptNodeStyle(node_title_styles),
      }))
      .sort((a, b) => a.node_id - b.node_id),
  );
};

export { assertNodeMeta };
