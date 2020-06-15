import { getTreeInDom } from '../helpers/dom';

export const assertTreeStructure = ({ tree }) => {
  cy.document().then(document => {
    const treeInDom = getTreeInDom({ document, tree });
    treeInDom.forEach((nodesLevel, indexOfLevel) => {
      const nOfNodesInLevelInDom = nodesLevel.length;
      const nOfNodesInLevel = tree[indexOfLevel].length;
      expect(nOfNodesInLevelInDom).equal(nOfNodesInLevel);
    });
  });
};
