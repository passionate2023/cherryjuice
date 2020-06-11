import { login } from '../support/workflows/login';
import { generateTree } from '../fixtures/nodes';
import { createNode, editNode } from '../support/workflows/tree/create-node';
import { wait } from '../support/helpers/cypress-helpers';
import { goHome } from '../support/workflows/navigate-home';
import { createDocument } from '../support/workflows/create-document';
import { getTreeInDom } from '../support/helpers/dom';
import { dndNode } from '../support/workflows/tree/dnd-node';
import {
  assertNodeName,
  assertNodesName,
} from '../support/assertions/nodes-name';
import {
  assertNodesTitleStyle,
  assertNodeTitleStyle,
} from '../support/assertions/nodes-title-style';
import { assertTreeStructure } from '../support/assertions/tree-structure';
import { deleteNode } from '../support/workflows/tree/delete-node';
import { testIds } from '../support/helpers/test-ids';

describe('create document > create nodes > dnd > edit', () => {
  before(() => {
    Cypress.on('scrolled', $el => {
      $el.get(0).scrollIntoView({
        block: 'center',
        inline: 'center',
      });
    });
    cy.visit(`/`);
    login();
  });

  const tree = generateTree({
    nodesPerLevel: [[2], [2], [1]],
  });
  const newAttributes = {
    name: 'new name',
    icon: 48,
    color: '#ff0fff',
    isBold: true,
  };

  it('perform: create document', () => {
    goHome();
    createDocument();
  });
  it('perform: create nodes', () => {
    for (const node of tree.flatMap(x => x)) {
      createNode({ node });
      wait.ms500();
    }
  });

  it('assert: nodes name', () => {
    wait.s1();
    assertNodesName({ tree });
  });
  it('assert: nodes font-weight and color and icons', () => {
    assertNodesTitleStyle({ tree });
  });

  it('perform: dnd node', () => {
    dndNode({ tree });
  });

  it('assert: nodes structure', () => {
    wait.s1();
    assertTreeStructure({ tree });
  });

  it('perform: delete node', () => {
    deleteNode({ tree });
  });

  it('assert: nodes structure', () => {
    wait.s1();
    assertTreeStructure({ tree });
  });

  it('perform: edit node meta', () => {
    editNode({
      editedNode: tree[0][0],
      newAttributes,
    });
  });

  it('assert: edited node meta', () => {
    wait.s1();
    cy.document().then(document => {
      const treeInDom = getTreeInDom({ document, tree });
      const nodeInDom = treeInDom[0][0];
      assertNodeName({ nodeInDom })({ node: tree[0][0] });
      assertNodeTitleStyle({ nodeInDom })({ node: tree[0][0] });
    });
  });

  it('perform: save document', () => {
    cy.findByTestId(testIds.toolBar__main__saveDocument).click();
    cy.contains('Document saved', { timeout: 10000 });
  });
  it('assert: nodes structure', () => {
    wait.s1();
    assertTreeStructure({ tree });
  });

  it('assert: nodes names', () => {
    wait.s1();
    assertNodesName({ tree });
  });
  it('assert: nodes font-weight and color and icons', () => {
    assertNodesTitleStyle({ tree });
  });
});
