import { login } from '../support/workflows/login';
import { fixScrolling } from '../support/helpers/cypress-helpers';
import { goHome } from '../support/workflows/navigate-home';
import { assertNodesName } from '../support/assertions/nodes-name';
import { assertTreeStructure } from '../support/assertions/tree-structure';
import { testIds } from '../support/helpers/test-ids';
import { assertNodeText } from '../support/assertions/content/node-text';
import { assertNodeImage } from '../support/assertions/content/node-image';
import { createImageGenerator } from '../fixtures/node/generate-node-content/image/generate-image';
import { dialogs } from '../support/workflows/dialogs/dialogs';
import { editor } from '../support/workflows/editor/editor';
import { generateDocument } from '../fixtures/document/generate-document';
import { documentPuppeteer } from '../support/workflows/document/document-puppeteer';

describe('create document > create nodes', () => {
  before(() => {
    fixScrolling();
    cy.visit(`/`);
    login();
    goHome();
    dialogs.documentsList.close();
  });

  const document = generateDocument({
    treeConfig: {
      nodesPerLevel: [[2]],
      includeText: true,
      numberOfImages: [2, 5],
    },
    documentConfig: {
      name: new Date().toString(),
    },
  });

  it('perform: create document', () => {
    dialogs.documentMeta.create(document.meta);
  });
  it('perform: create nodes', () => {
    documentPuppeteer.createTree(document);
  });

  it('assert: nodes name', () => {
    assertNodesName(document);
  });
  it('assert: nodes structure', () => {
    assertTreeStructure(document);
  });

  it('perform: paste blob images', () => {
    document.tree[0].forEach(node => {
      editor.clipboard.pasteBlobImages({
        node,
        images: node.images.filter((_, i) => i >= node.images.length - 1),
      });
    });
  });

  it('perform: paste html images', () => {
    document.tree[0].forEach(node => {
      editor.clipboard.pasteHtmlImages({
        node,
        images: node.images.filter((_, i) => i < node.images.length - 1),
      });
    });
  });

  it('perform: write text', () => {
    editor.keyboard.typeText(document.tree[0]);
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
      editor.clipboard.pasteHtmlImages({ node, images: [additionalImage] });
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
