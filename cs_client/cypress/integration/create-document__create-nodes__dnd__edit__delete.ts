import { login } from '../support/workflows/login';
import { createNode, editNode } from '../support/workflows/tree/create-node';
import { fixScrolling, wait } from '../support/helpers/cypress-helpers';
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
import { generateTree } from '../fixtures/tree/generate-tree';
import { documentList } from '../support/workflows/dialogs/document-list';

describe('create document > create nodes > dnd > edit', () => {
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
      nodesPerLevel: [[2], [2], [1]],
    }),
  };
  const newAttributes = {
    name: 'new name',
    icon: 48,
    color: '#ff0fff',
    isBold: true,
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
  it('assert: nodes font-weight and color and icons', () => {
    assertNodesTitleStyle(document);
  });

  it('perform: dnd node', () => {
    dndNode(document);
  });

  it('assert: nodes structure', () => {
    wait.s1();
    assertTreeStructure(document);
  });

  it('perform: delete node', () => {
    deleteNode(document);
  });

  it('assert: nodes structure', () => {
    wait.s1();
    assertTreeStructure(document);
  });

  it('perform: edit node meta', () => {
    editNode({
      editedNode: document.tree[0][0],
      newAttributes,
    });
  });

  it('assert: edited node meta', () => {
    wait.s1();
    cy.document().then(domDocument => {
      const treeInDom = getTreeInDom({
        document: domDocument,
        tree: document.tree,
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
    wait.s1();
    assertTreeStructure(document);
  });

  it('assert: nodes names', () => {
    wait.s1();
    assertNodesName(document);
  });
  it('assert: nodes font-weight and color and icons', () => {
    assertNodesTitleStyle(document);
  });
});
