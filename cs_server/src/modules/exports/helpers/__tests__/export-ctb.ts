import { ExportCTB } from '../export-ctb';
import * as fs from 'fs';
import { createTree } from './__data__/create-tree';
import { ahtmlXmlSamples } from '../helpers/ahtml-to-ctb/helpers/translate-ahtml/__tests__/__data__/ahtml-xml-samples/ahtml-xml-samples';
import { selectNode_ids } from './__data__/select-node_ids';
import { Node } from '../../../node/entities/node.entity';
import { getLoadedImages } from './__data__/images/get-loaded-images';
import { assertNodeMeta } from './__assertions__/node-meta';
import { NodeFromPG } from '../helpers/ahtml-to-ctb/helpers/translate-ahtml/__tests__/__data__/ahtml-xml-samples/02';
import { createCTB } from './__pereparations__/create-ctb';

jest.setTimeout(15 * 60 * 1000);

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
    await state.exportCtb.writeAHtmls([rootNode, ...nodes]);
    await assertNodeMeta(state.exportCtb, (nodes as unknown) as NodeFromPG[]);
  });
});

describe('export-ctb - create and populate complex ctb', () => {
  const state: { exportCtb: ExportCTB } = { exportCtb: undefined };
  beforeAll(async () => {
    state.exportCtb = await createCTB('complex ctb', '12345', {
      verbose: false,
    });
  });

  it(`export document ${ahtmlXmlSamples[0][0].documentId}`, async () => {
    const nodeCategories = {
      codebox: [11, 12, 14],
      colorful: [134, 7, 16, 17, 18, 9, 6, 4, 1, 3],
      table: [42],
      anchors: [2],
      images: [133],
    };
    // eslint-disable-next-line no-unused-vars
    const node_idsSelection = [
      // nodeCategories.colorful,
      // nodeCategories.codebox,
      // nodeCategories.table,
      // nodeCategories.anchors,
      nodeCategories.images,
    ].flatMap(x => x);

    const { nodes, rootNode } = selectNode_ids()(ahtmlXmlSamples[0]);
    const imagesPerNode = await state.exportCtb.writeAHtmls(([
      ...nodes,
      rootNode,
    ] as unknown) as Node[]);

    await state.exportCtb.writeNodesImages({
      imagesPerNode,
      getNodeImages: getLoadedImages,
    });
    await assertNodeMeta(state.exportCtb, nodes);
  });
});
