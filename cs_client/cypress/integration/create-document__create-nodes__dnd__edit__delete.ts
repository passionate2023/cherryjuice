import { wait } from '../support/helpers/cypress-helpers';
import { getTreeInDom } from '../support/helpers/dom';
import { dndNode } from '../support/workflows/tree/helpers/dnd-node';
import {
  assertNodeName,
  assertNodesName,
} from '../support/assertions/nodes-name';
import {
  assertNodesTitleStyle,
  assertNodeTitleStyle,
} from '../support/assertions/nodes-title-style';
import { assertTreeStructure } from '../support/assertions/tree-structure';
import { testIds } from '../support/helpers/test-ids';
import { dialogs } from '../support/workflows/dialogs/dialogs';
import { generateDocument } from '../fixtures/document/generate-document';
import { puppeteer } from '../support/workflows/document/puppeteer';
import { users } from '../fixtures/auth/login-credentials';
import { tn } from '../support/workflows/tests-names';
import { assert } from '../support/assertions/assertions';

describe('create document > create nodes > dnd > edit', () => {
  const document = generateDocument({
    documentConfig: {
      name: new Date().toString(),
    },
    treeConfig: {
      nodesPerLevel: [[2], [2], [1]],
    },
  });
  const newAttributes = {
    name: 'new name',
    icon: 48,
    color: '#ff0fff',
    isBold: true,
  };

  before(() => {
    puppeteer.auth.signIn(users.user0);
    puppeteer.manage.deleteDocuments([], true);
  });

  it(tn.p.createDocument(document), () => {
    puppeteer.manage.createDocument(document);
  });

  it('assert: nodes name', () => {
    assertNodesName(document);
  });
  it('assert: nodes font-weight and color and icons', () => {
    assertNodesTitleStyle(document);
  });

  it('perform: dnd node', () => {
    dndNode(document);
  });

  it('assert: nodes structure', () => {
    assertTreeStructure(document);
  });

  it('perform: delete node', () => {
    dialogs.nodeMeta.delete({ tree: document.tree, nodeCoordinates: [0, 0] });
  });

  it(tn.a.docContent(document), () => {
    assert.documentContent(document);
  });

  it('perform: edit node meta', () => {
    dialogs.nodeMeta.edit({
      editedNode: document.tree[0][0],
      newAttributes,
    });
  });

  it('assert: edited node meta', () => {
    wait.s1;
    cy.document().then(domDocument => {
      const treeInDom = getTreeInDom({
        document: domDocument,
        nOfLevels: document.tree.filter(level => Boolean(level.length)).length,
      });
      const nodeInDom = treeInDom[0][0];
      assertNodeName({ nodeInDom })({ node: document.tree[0][0] });
      assertNodeTitleStyle({ nodeInDom })({ node: document.tree[0][0] });
    });
  });

  it('perform: save document', () => {
    cy.findByTestId(testIds.toolBar__main__saveDocument).click();
    cy.contains('Document saved', { timeout: 10000 });
  });
  it('assert: nodes structure', () => {
    assertTreeStructure(document);
  });

  it('assert: nodes names', () => {
    assertNodesName(document);
  });
  it('assert: nodes font-weight and color and icons', () => {
    assertNodesTitleStyle(document);
  });
});
