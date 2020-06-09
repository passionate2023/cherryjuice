import { getTreeInDom } from '../helpers/dom';

export const assertTreeStructure = ({ tree }) => {
  cy.document().then(document => {
    const treeInDom = getTreeInDom({ document, tree });
    treeInDom.forEach((nodesLevel, indexOfLevel) => {
      const nOfNodesInLevel = nodesLevel.length;
      expect(nOfNodesInLevel).equal(tree[indexOfLevel].length);
    });
  });
};
