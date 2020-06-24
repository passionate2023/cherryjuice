import { ExportCTB } from '../export-ctb';
import * as fs from 'fs';
import { createTree } from './__data__/create-tree';
import { adaptNodeStyle } from '../helpers/adapt-node-meta';
import { ahtmlXmlSamples } from '../../../node/helpers/rendering/mutate/ahtml-to-ctb/helpers/translate-ahtml/__tests__/__data__/ahtml-xml-samples/ahtml-xml-samples';
import { selectNode_ids } from './__data__/select-node_ids';
import { Node } from '../../../node/entities/node.entity';

jest.setTimeout(20000);

describe('export-ctb - create and populate basic ctb', () => {
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
    await state.exportCtb.writeNodes([rootNode, ...nodes]);
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

describe('export-ctb - create and populate complex ctb', () => {
  const state: { exportCtb: ExportCTB; documentExists?: boolean } = {
    exportCtb: undefined,
  };
  beforeAll(async () => {
    state.exportCtb = new ExportCTB('monday-14', '12345', {
      verbose: true,
      addSuffixToDocumentName: false,
    });
    try {
      await state.exportCtb.createCtb();
      await state.exportCtb.createTables();
    } catch (e) {
      await state.exportCtb.getDb.exec(
        ['node', 'codebox', 'children']
          .map(table => `delete from "main"."${table}"`)
          .join(';'),
      );
    }
  });

  it(`export document ${ahtmlXmlSamples[0][0].documentId}`, async () => {
    const nodeCategories = {
      codebox: [11, 12, 14],
      colorful: [134, 7, 16, 17, 18, 9, 6, 2, 4, 1, 3],
    };
    const node_idsSelection = [
      nodeCategories.colorful,
      nodeCategories.codebox,
    ].flatMap(x => x);

    const nodes = (selectNode_ids(node_idsSelection)(
      ahtmlXmlSamples[0],
    ) as unknown) as Node[];
    await state.exportCtb.writeNodes(nodes);
  });
});
