import { rgbToHex } from '../../../../../helpers/javascript-utils';
import { AssertNodeMeta } from './assert-node-name';

export const assertNodeTitleStyle = ({ nodeAst, domNode }: AssertNodeMeta) => {
  const nodeTitle: HTMLDivElement = domNode.querySelector('.node__title');
  const { fontWeight } = nodeTitle.style;
  expect(fontWeight).equal(nodeAst.isBold ? 'bold' : '');

  const { color } = nodeTitle.style;
  expect(rgbToHex(color)).equal(nodeAst.color || '#ffffff');

  const nodeCherry = domNode.childNodes[2] as HTMLDivElement;
  expect(nodeCherry.dataset.testid).equal('cherry' + nodeAst.icon);
};
