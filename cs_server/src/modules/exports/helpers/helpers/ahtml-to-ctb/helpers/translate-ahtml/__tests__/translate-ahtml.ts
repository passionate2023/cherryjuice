import { translateAHtml } from '../translate-ahtml';
import { ahtmlXmlSamples } from './__data__/ahtml-xml-samples/ahtml-xml-samples';
import { NodeFromPG } from './__data__/ahtml-xml-samples/02';
import { selectNode_ids } from '../../../../../__tests__/__data__/select-node_ids';

const testTemplate = ({ nodes }: { nodes: NodeFromPG[] }) => {
  nodes.forEach(node => {
    const res = translateAHtml(JSON.parse(node.ahtml));
    // eslint-disable-next-line no-console
    console.log(res);
    expect(res).toBeDefined();
  });
};

describe('translate-ahtml', () => {
  for (const nodes of ahtmlXmlSamples) {
    test(`document ${nodes[0].documentId}`, () => {
      testTemplate(selectNode_ids([7])(nodes));
    });
  }
});