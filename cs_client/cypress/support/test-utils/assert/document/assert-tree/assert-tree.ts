import { getTreeInDom } from '../../../../helpers/dom';
import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { filterPrivateNodes } from './helpers/filter-private-nodes';
import { assertNodeName } from './assertions/assert-node-name';
import { assertNodeTitleStyle } from './assertions/assert-node-style';
import { assertNumberOfNodes } from './assertions/assert-number-of-level-nodes';

export const assertTree = (docAst: DocumentAst) => {
  cy.log('assert-tree');
  const tree = filterPrivateNodes(docAst);
  cy.document().then(document => {
    const treeInDom = getTreeInDom({
      document,
      nOfLevels: tree.length,
    });
    treeInDom.forEach((nodesLevelInDom, levelDepth) => {
      assertNumberOfNodes({
        nOfAstNodes: tree[levelDepth].length,
        nOfDomNodes: nodesLevelInDom.length,
      });
      nodesLevelInDom.forEach((domNode, indexOfNode) => {
        const nodeAst = tree[levelDepth][indexOfNode];
        assertNodeName({ domNode, nodeAst });
        assertNodeTitleStyle({ domNode, nodeAst });
      });
    });
  });
};
