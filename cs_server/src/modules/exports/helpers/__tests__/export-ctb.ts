import { ExportCTB } from '../export-ctb';
import * as fs from 'fs';
import { createTree } from './__data__/create-tree';
import { adaptNodeStyle } from '../helpers/adapt-node-meta';

jest.setTimeout(20000);

describe('export-ctb helpers', () => {
  const state: { exportCtb: ExportCTB } = {
    exportCtb: undefined,
  };
  beforeAll(() => {
    state.exportCtb = new ExportCTB(new Date().getTime().toString(), '12345');
  });
  it('should create an empty ctb file', async () => {
    const db = await state.exportCtb.createCtb();
    expect(db).toBeDefined();
    expect(fs.existsSync(state.exportCtb.getDocumentPath)).toBeTruthy();
  });
  it('should create tables in the ctb file', async () => {
    await state.exportCtb.createTables();
    const size = fs.statSync(state.exportCtb.getDocumentPath).size;
    expect(size).toEqual(40960);
  });
  it('should write node meta to node and children tables', async () => {
    const { rootNode, nodes } = createTree();
    await state.exportCtb.writeNodesMeta([rootNode, ...nodes]);
    const writtenNodes = await state.exportCtb.getDb.all(
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
  });
});
