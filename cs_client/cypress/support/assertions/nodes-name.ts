import { getTreeInDom } from '../helpers/dom';
import { wait } from '../helpers/cypress-helpers';

export const assertNodeName = ({ nodeInDom }) => ({ node }) => {
  expect(nodeInDom.innerText).equal(node.name);
};

export const assertNodesName = ({ tree }) => {
  wait.s1();
  cy.document().then(document => {
    const treeInDom = getTreeInDom({
      document,
      tree,
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
