import { getTreeInDom } from '../helpers/dom';
import { wait } from '../helpers/cypress-helpers';
import { filterPrivateNodes, filterPrivateNodesOfLevel } from './nodes-name';
import { DocumentAst } from '../../fixtures/document/generate-document';

export const assertTreeStructure = (docAst: DocumentAst) => {
  cy.log('assertTreeStructure');
  wait.s1;
  cy.document().then(document => {
    const treeInDom = getTreeInDom({
      document,
      nOfLevels: filterPrivateNodes(docAst).length,
    });
    treeInDom.forEach((nodesLevel, indexOfLevel) => {
      const nOfNodesInLevelInDom = nodesLevel.length;
      const nOfNodesInLevel = filterPrivateNodes(docAst)[indexOfLevel].filter(
        filterPrivateNodesOfLevel(docAst.meta.privacy),
      ).length;
      expect(nOfNodesInLevelInDom).equal(nOfNodesInLevel);
    });
  });
};
