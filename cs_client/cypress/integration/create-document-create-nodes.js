import { login } from '../support/workflows/login';
import { generateFlatTree } from '../fixtures/nodes';
import { createNode } from '../support/workflows/create-node';
import { wait } from '../support/helpers/cypress-helpers';
import { goHome } from '../support/workflows/navigate-home';
import { createDocument } from '../support/workflows/create-document';
import { getElementPath, getTreeInDom } from '../support/helpers/dom';
import {
  randomArrayElement,
  removeArrayElement,
  rgbToHex,
} from '../support/helpers/javascript-utils';

describe('create document > create nodes', () => {
  before(() => {
    Cypress.on('scrolled', $el => {
      $el.get(0).scrollIntoView({
        block: 'center',
        inline: 'center',
      });
    });
    login();
  });
  const tree = generateFlatTree({
    nodesPerLevel: [[2], [2], [1]],
  });
  const flatTree = tree.flatMap(x => x);

  it('create document', () => {
    goHome();
    createDocument();
  });
  it('create nodes', () => {
    for (const node of flatTree) {
      createNode(node);
      wait.ms500();
    }
  });
  it('perform dnd', () => {
    const sourceLevel = tree[tree.length - 1];
    const newParentLevel = tree[0];
    const getTargetLevel = () => tree[1];
    const setTargetLevel = arr => (tree[1] = arr);
    const draggedNode = randomArrayElement(sourceLevel);
    const targetNode = randomArrayElement(newParentLevel);
    draggedNode.parent = targetNode;
    removeArrayElement(sourceLevel, draggedNode);
    getTargetLevel().push(draggedNode);
    setTargetLevel(getTargetLevel().sort((a, b) => a.parent.id - b.parent.id));
    cy.findAllByText(draggedNode.name).then(target$ => {
      wait.ms250();
      cy.findAllByText(targetNode.name).then(dragged$ => {
        wait.ms250();
        const targetSelector = getElementPath(target$[1], 'tree');
        const draggedSelector = getElementPath(dragged$[1], 'tree');
        cy.get(targetSelector).drag(draggedSelector, { force: true });
      });
    });
  });
  it.skip('perform meta edit', () => undefined);
  it.skip('perform deletion', () => undefined);

  it('test nodes structure', () => {
    cy.document().then(document => {
      const treeInDom = getTreeInDom({ document, tree });
      treeInDom.forEach((nodesLevel, indexOfLevel) => {
        const nOfNodesInLevel = nodesLevel.length;
        expect(nOfNodesInLevel).equal(tree[indexOfLevel].length);
      });
    });
  });
  it('test nodes names', () => {
    cy.document().then(document => {
      const treeInDom = getTreeInDom({
        document,
        tree,
      });
      treeInDom.forEach((nodesLevel, indexOfLevel) => {
        nodesLevel.forEach((nodeElement, indexOfNode) => {
          expect(nodeElement.innerText).equal(
            tree[indexOfLevel][indexOfNode].name,
          );
        });
      });
    });
  });
  it('test nodes font-weight and color', () => {
    cy.document().then(document => {
      const treeInDom = getTreeInDom({ document, tree });
      treeInDom.forEach((nodesLevel, indexOfLevel) => {
        nodesLevel.forEach((nodeInDom, indexOfNode) => {
          const plannedNode = tree[indexOfLevel][indexOfNode];
          const nodeTitle = nodeInDom.querySelector('.node__title');

          const { fontWeight } = nodeTitle.style;
          expect(fontWeight).equal(plannedNode.isBold ? 'bold' : 'normal');

          const { color } = nodeTitle.style;
          expect(rgbToHex(color)).equal(plannedNode.color || '#ffffff');

          const nodeCherry = nodeInDom.childNodes[2];
          expect(nodeCherry.dataset.testid).equal('cherry' + plannedNode.icon);
        });
      });
    });
  });
  it('test nodes custom-icons', () => {
    cy.document().then(document => {
      const treeInDom = getTreeInDom({ document, tree });
      treeInDom.forEach((nodesLevel, indexOfLevel) => {
        nodesLevel.forEach((nodeInDom, indexOfNode) => {
          const plannedNode = tree[indexOfLevel][indexOfNode];
          const nodeCherry = nodeInDom.childNodes[2];
          expect(nodeCherry.dataset.testid).equal('cherry' + plannedNode.icon);
        });
      });
    });
  });

  it.skip('test saving', () => undefined);
});
