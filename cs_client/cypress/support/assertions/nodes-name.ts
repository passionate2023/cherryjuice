import { getTreeInDom } from '../helpers/dom';
import { wait } from '../helpers/cypress-helpers';
import { DocumentAst } from '../../fixtures/document/generate-document';
import { NodeAst } from '../../fixtures/node/generate-node';
import { NodePrivacy, Privacy } from '../../../types/graphql/generated';
import { privacyIsBelow } from '../../../src/components/app/menus/document-meta/components/select-privacy/select-privacy';
import { TreeAst } from '../../fixtures/tree/generate-tree';

export const assertNodeName = ({ nodeInDom }) => ({ node }) => {
  expect(nodeInDom.innerText).equal(node.name);
};

export const filterPrivateNodesOfLevel = (docPrivacy: Privacy) => (
  node: NodeAst,
) =>
  node.privacy && node.privacy !== NodePrivacy.DEFAULT
    ? !privacyIsBelow(node.privacy)(docPrivacy)
    : true;

export const filterPrivateNodes = (docAst: DocumentAst): TreeAst => {
  return docAst.tree.reduce(
    (acc, level) => {
      const levelLength = level.filter(
        filterPrivateNodesOfLevel(docAst.meta.privacy),
      ).length;
      if (levelLength > 0 && !acc.foundEmptyLevel) {
        acc.tree.push(level);
      } else {
        acc.foundEmptyLevel = true;
      }
      return acc;
    },
    { tree: [], foundEmptyLevel: false },
  ).tree;
};

export const assertNodesName = (docAst: DocumentAst) => {
  cy.log('assertNodesName');
  const tree = docAst.tree;
  wait.s1;
  cy.document().then(document => {
    const treeInDom = getTreeInDom({
      document,
      nOfLevels: filterPrivateNodes(docAst).length,
    });
    treeInDom.forEach((nodesLevel, indexOfLevel) => {
      nodesLevel.forEach((nodeInDom, indexOfNode) => {
        assertNodeName({
          nodeInDom,
        })({
          node: tree[indexOfLevel][indexOfNode],
        });
      });
    });
  });
};
