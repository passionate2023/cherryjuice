import { getTreeInDom } from '../helpers/dom';
import { rgbToHex } from '../helpers/javascript-utils';

export const assertNodeTitleStyle = ({ nodeInDom }) => ({ node }) => {
  const nodeTitle = nodeInDom.querySelector('.node__title');
  const { fontWeight } = nodeTitle.style;
  expect(fontWeight).equal(node.isBold ? 'bold' : '');

  const { color } = nodeTitle.style;
  expect(rgbToHex(color)).equal(node.color || '#ffffff');

  const nodeCherry = nodeInDom.childNodes[2];
  expect(nodeCherry.dataset.testid).equal('cherry' + node.icon);
};

export const assertNodesTitleStyle = ({ tree }) => {
  cy.document().then(document => {
    const treeInDom = getTreeInDom({
      document,
      nOfLevels: tree.filter(level => Boolean(level.length)).length,
    });
    treeInDom.forEach((nodesLevel, indexOfLevel) => {
      nodesLevel.forEach((nodeInDom, indexOfNode) => {
        const node = tree[indexOfLevel][indexOfNode];
        assertNodeTitleStyle({ nodeInDom })({ node });
      });
    });
  });
};
