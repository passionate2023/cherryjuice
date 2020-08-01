import { NodeAst } from '../../../../../../fixtures/node/generate-node';

export type AssertNodeMeta = {
  domNode: HTMLDivElement;
  nodeAst: NodeAst;
};
export const assertNodeName = ({ domNode, nodeAst }: AssertNodeMeta) => {
  expect(domNode.innerText).equal(nodeAst.name);
};
