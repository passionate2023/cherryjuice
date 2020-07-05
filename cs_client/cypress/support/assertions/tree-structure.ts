import { getTreeInDom } from '../helpers/dom';
import { wait } from '../helpers/cypress-helpers';

export const assertTreeStructure = ({ tree }) => {
  wait.s1();
  cy.document().then(document => {
    const treeInDom = getTreeInDom({ document, tree });
    treeInDom.forEach((nodesLevel, indexOfLevel) => {
      const nOfNodesInLevelInDom = nodesLevel.length;
      const nOfNodesInLevel = tree[indexOfLevel].length;
      expect(nOfNodesInLevelInDom).equal(nOfNodesInLevel);
    });
  });
};
