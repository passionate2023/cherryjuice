import { ExportCTB } from '../export-ctb';
import * as fs from 'fs';
import { createTree } from './__data__/create-tree';
import { ahtmlXmlSamples } from '../helpers/ahtml-to-ctb/helpers/translate-ahtml/__tests__/__data__/ahtml-xml-samples/ahtml-xml-samples';
import { selectNode_ids } from './__data__/select-node_ids';
import { Node } from '../../../node/entities/node.entity';
import { getLoadedImages } from './__data__/images/get-loaded-images';
import { assertNodeMeta } from './__assertions__/node-meta';
import { NodeFromPG } from '../helpers/ahtml-to-ctb/helpers/translate-ahtml/__tests__/__data__/ahtml-xml-samples/02';
import { createCTB } from './__preparations__/create-ctb';

jest.setTimeout(15 * 60 * 1000);

describe('export-ctb - create and populate basic ctb', () => {
  const state: { exportCtb: ExportCTB } = {
    exportCtb: undefined,
  };
  beforeAll(() => {
    state.exportCtb = new ExportCTB({
      userId: 'test1',
      id: 'doc1',
      hash: new Date().getTime().toString(),
      name: 'test1-document',
    });
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
    state.exportCtb = await createCTB(
      {
        userId: 'test2',
        id: 'doc1',
        hash: '1234',
        name: 'test2-document',
      },
      {
        verbose: false,
      },
    );
  });

  it(`export document ${ahtmlXmlSamples[0][0].documentId}`, async () => {
    const nodeCategories = {
      codebox: [11, 12, 14],
      colorful: [134, 7, 16, 17, 18],
      table: [42],
      anchors: [2],
      links: [9],
      images: [133],
      justification: [38],
    };
    // eslint-disable-next-line no-unused-vars
    let node_idsSelection: number[];
    // eslint-disable-next-line prefer-const
    node_idsSelection = [nodeCategories.justification].flatMap(x => x);

    const { nodes, rootNode } = selectNode_ids(node_idsSelection)(
      ahtmlXmlSamples[0],
    );
    if (node_idsSelection?.length) {
      rootNode.child_nodes = node_idsSelection as any;
      nodes.forEach(node => {
        node.father_id = rootNode.node_id;
      });
    }
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
