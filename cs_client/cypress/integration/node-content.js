import { login } from '../support/workflows/login';
import { generateTree } from '../fixtures/nodes';
import { createNode } from '../support/workflows/create-node';
import { wait } from '../support/helpers/cypress-helpers';
import { goHome } from '../support/workflows/navigate-home';
import { createDocument } from '../support/workflows/create-document';
import { assertNodesName } from '../support/assertions/nodes-name';
import { assertTreeStructure } from '../support/assertions/tree-structure';
import { testIds } from '../support/helpers/test-ids';
import { writeText } from '../support/workflows/content/write-text';
import { assertNodeText } from '../support/assertions/content/node-text';

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
  const tree = generateTree({
    nodesPerLevel: [[2]],
    includeText: true,
  });

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
  it('assert: nodes structure', () => {
    wait.s1();
    assertTreeStructure({ tree });
  });

  it('perform: write text', () => {
    tree[0].forEach(node => {
      writeText({ node, text: node.text });
    });
  });

  it('perform: save document', () => {
    cy.findByTestId(testIds.toolBar__main__saveDocument).click();
    cy.contains('Document saved', { timeout: 10000 });
  });
  it('assert: written text', () => {
    tree[0].forEach(node => {
      assertNodeText({ node, text: node.text });
    });
  });
});
