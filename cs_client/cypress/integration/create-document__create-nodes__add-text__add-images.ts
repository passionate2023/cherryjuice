import { login } from '../support/workflows/login';
import { createNode } from '../support/workflows/tree/create-node';
import { wait } from '../support/helpers/cypress-helpers';
import { goHome } from '../support/workflows/navigate-home';
import { createDocument } from '../support/workflows/create-document';
import { assertNodesName } from '../support/assertions/nodes-name';
import { assertTreeStructure } from '../support/assertions/tree-structure';
import { testIds } from '../support/helpers/test-ids';
import { writeText } from '../support/workflows/content/write-text';
import { assertNodeText } from '../support/assertions/content/node-text';
import { writeImage } from '../support/workflows/content/write-image';
import { assertNodeImage } from '../support/assertions/content/node-image';
import { createImageGenerator } from '../fixtures/node/generate-node-content/image/generate-image';
import { generateTree } from '../fixtures/tree/generate-tree';

describe('create document > create nodes', () => {
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
    nodesPerLevel: [[2]],
    includeText: true,
    numberOfImages: [2, 5],
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

  it('perform: paste html images', () => {
    tree[0].forEach(node => {
      writeImage({ node, images: node.images });
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

  it('assert: written images', () => {
    tree[0].forEach(node => {
      assertNodeImage({ node, images: node.images });
    });
  });

  it('perform: reload > login', () => {
    cy.location().then(({ pathname }) => {
      cy.reload();
      login();
      cy.visit(pathname);
      cy.contains(tree[0][0].name, { timeout: 10000 });
    });
  });

  it('perform: write additional image', () => {
    const imageGenerator = createImageGenerator(['black'])(['white']);
    tree[0].forEach(node => {
      const additionalImage = imageGenerator([node.name, 'image x']);
      node.images.push(additionalImage);
      writeImage({ node, images: [additionalImage] });
    });
  });

  it('assert: written images', () => {
    tree[0].forEach(node => {
      assertNodeImage({ node, images: node.images });
    });
  });

  it('perform: save document', () => {
    cy.findByTestId(testIds.toolBar__main__saveDocument).click();
    cy.contains('Document saved', { timeout: 10000 });
  });

  it('assert: written images', () => {
    tree[0].forEach(node => {
      assertNodeImage({ node, images: node.images });
    });
  });
});
