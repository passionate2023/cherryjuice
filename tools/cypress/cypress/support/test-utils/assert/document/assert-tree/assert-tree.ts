import { getTreeInDom } from '../../../../helpers/dom';
import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { filterPrivateNodes } from './helpers/filter-private-nodes';
import { assertNodeName } from './assertions/assert-node-name';
import { assertNodeTitleStyle } from './assertions/assert-node-style';
import { assertNumberOfNodes } from './assertions/assert-number-of-level-nodes';

export const assertTree = (docAst: DocumentAst) => {
  cy.log('assert-tree');
  cy.get('.tree', { timeout: 20000 });
  const astTree = filterPrivateNodes(docAst);
  cy.document().then(document => {
    const treeInDom = getTreeInDom({
      document,
      nOfLevels: astTree.length,
    });
    treeInDom.forEach((nodesLevelInDom, levelDepth) => {
      assertNumberOfNodes({
        nOfAstNodes: astTree[levelDepth].length,
        nOfDomNodes: nodesLevelInDom.length,
      });
      nodesLevelInDom.forEach((domNode, indexOfNode) => {
        const nodeAst = astTree[levelDepth][indexOfNode];
        assertNodeName({ domNode, nodeAst });
        assertNodeTitleStyle({ domNode, nodeAst });
      });
    });
  });
};
