import { documentsFromPG } from './__data__/documents/documents-from-pg';
import { NodeFromPG } from './__data__/documents/02';
import { selectNode_ids } from '../../../__tests__/__data__/select-node_ids';
import { aHtmlToCtb } from '../ahtml-to-ctb';

const testTemplate = ({ nodes }: { nodes: NodeFromPG[] }) => {
  nodes.forEach(node => {
    const res = aHtmlToCtb(node.node_id)(JSON.parse(node.ahtml));
    expect(res).toMatchSnapshot();
  });
};

describe('ahtml-to-import-ctb', () => {
  for (const document of documentsFromPG) {
    test(`document: ${document.name}`, () => {
      testTemplate(selectNode_ids()(document.nodes));
    });
  }
});
