import { rgbToHex } from '../../../../../helpers/javascript-utils';
import { AssertNodeMeta } from './assert-node-name';

export const assertNodeTitleStyle = ({ nodeAst, domNode }: AssertNodeMeta) => {
  const nodeTitle = domNode.childNodes[3] as HTMLDivElement;
  const { fontWeight } = nodeTitle.style;
  expect(fontWeight).equal(nodeAst.isBold ? 'bold' : '');

  const { color } = nodeTitle.style;
  expect(color ? rgbToHex(color) : '').equal(nodeAst.color || '');

  const nodeCherry = domNode.childNodes[2].childNodes[0] as HTMLDivElement;
  expect(nodeCherry.dataset.testid).equal('cherry' + nodeAst.icon);
};
