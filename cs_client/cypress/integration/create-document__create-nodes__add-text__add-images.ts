import { login } from '../support/workflows/login';
import { createNode } from '../support/workflows/tree/create-node';
import { fixScrolling, wait } from '../support/helpers/cypress-helpers';
import { goHome } from '../support/workflows/navigate-home';
import { createDocument } from '../support/workflows/create-document';
import { assertNodesName } from '../support/assertions/nodes-name';
import { assertTreeStructure } from '../support/assertions/tree-structure';
import { testIds } from '../support/helpers/test-ids';
import { writeText } from '../support/workflows/content/write-text';
import { assertNodeText } from '../support/assertions/content/node-text';
import {
  writeBlobImages,
  writeHtmlImages,
} from '../support/workflows/content/write-image';
import { assertNodeImage } from '../support/assertions/content/node-image';
import { createImageGenerator } from '../fixtures/node/generate-node-content/image/generate-image';
import { generateTree } from '../fixtures/tree/generate-tree';
import { documentList } from '../support/workflows/dialogs/document-list';

describe('create document > create nodes', () => {
  before(() => {
    fixScrolling();
    cy.visit(`/`);
    login();
    goHome();
    documentList.close();
  });
  const document = {
    meta: {
      name: new Date().toString(),
    },
    tree: generateTree({
      nodesPerLevel: [[2]],
      includeText: true,
      numberOfImages: [2, 5],
    }),
  };

  it('perform: create document', () => {
    createDocument(document.meta);
  });
  it('perform: create nodes', () => {
    for (const node of document.tree.flatMap(x => x)) {
      createNode({ node });
      wait.ms500();
    }
  });

  it('assert: nodes name', () => {
    wait.s1();
    assertNodesName(document);
  });
  it('assert: nodes structure', () => {
    wait.s1();
    assertTreeStructure(document);
  });

  it('perform: paste blob images', () => {
    document.tree[0].forEach(node => {
      writeBlobImages({
        node,
        images: node.images.filter((_, i) => i >= node.images.length - 1),
      });
    });
  });

  it('perform: paste html images', () => {
    document.tree[0].forEach(node => {
      writeHtmlImages({
        node,
        images: node.images.filter((_, i) => i < node.images.length - 1),
      });
    });
  });

  it('perform: write text', () => {
    document.tree[0].forEach(node => {
      writeText({ node, text: node.text });
    });
  });
  it('perform: save document', () => {
    cy.findByTestId(testIds.toolBar__main__saveDocument).click();
    cy.contains('Document saved', { timeout: 10000 });
  });

  it('assert: written text', () => {
    document.tree[0].forEach(node => {
      assertNodeText({ node, text: node.text });
    });
  });

  it('assert: written images', () => {
    for (const node of document.tree[0]) {
      assertNodeImage({ node, images: node.images });
    }
  });

  it('perform: reload > login', () => {
    cy.location().then(({ pathname }) => {
      cy.reload();
      login();
      cy.visit(pathname);
      cy.contains(document.tree[0][0].name, { timeout: 10000 });
    });
  });

  it('perform: write additional image', () => {
    const imageGenerator = createImageGenerator(['black'])(['white']);
    document.tree[0].forEach(node => {
      const additionalImage = imageGenerator({
        texts: [node.name, 'image x'],
        format: 'image/jpeg',
      });
      node.images.unshift(additionalImage);
      writeHtmlImages({ node, images: [additionalImage] });
    });
  });

  it('assert: written images', () => {
    for (const node of document.tree[0]) {
      assertNodeImage({ node, images: node.images });
    }
  });

  it('perform: save document', () => {
    cy.findByTestId(testIds.toolBar__main__saveDocument).click();
    cy.contains('Document saved', { timeout: 10000 });
  });

  it('assert: written images', () => {
    for (const node of document.tree[0]) {
      assertNodeImage({ node, images: node.images });
    }
  });
});
