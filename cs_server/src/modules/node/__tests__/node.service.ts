import { CreateNodeDto } from '../dto/create-node.dto';

import { createNodeTestHelpers, NodeTH } from '../../shared/test-helpers/node';
import {
  createDocumentTestHelpers,
  DocumentTH,
} from '../../shared/test-helpers/document';
import { User } from '../../user/entities/user.entity';

const user: User = ({
  id: '8112ec49-7d15-4971-80d7-2a536e937d65',
} as unknown) as User;

const createNodeDto: CreateNodeDto = {
  documentId: 'doc1',
  node_id: 2,
  meta: {
    child_nodes: [],
    name: 'node 2',
    node_id: 2,
    documentId: 'doc1',
    father_id: -1,
    fatherId: null,
    updatedAt: new Date().getTime(),
    node_title_styles: '',
    createdAt: new Date().getTime(),
    read_only: 0,
  },
};

describe.skip('node service', () => {
  let nodeTh: NodeTH, documentTh: DocumentTH;

  beforeAll(async () => {
    nodeTh = await createNodeTestHelpers();
    documentTh = await createDocumentTestHelpers();
  });

  afterAll(async () => {
    await nodeTh.module.close();
  });

  it('should be defined', async () => {
    expect(nodeTh.service).toBeDefined();
    expect(documentTh.service).toBeDefined();
    const document = await documentTh.service.createDocument({
      name: 'document 1',
      size: 0,
      user,
    });
    expect(document.id).toBeDefined();
    const node = await nodeTh.service.createNode({
      ...createNodeDto,
      documentId: document.id,
    });
    expect(node.id).toBeDefined();
  });
});
