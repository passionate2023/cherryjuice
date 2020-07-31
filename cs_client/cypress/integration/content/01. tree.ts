import { testIds } from '../../support/helpers/test-ids';
import { puppeteer } from '../../support/test-utils/puppeteer/puppeteer';
import { users } from '../../fixtures/auth/login-credentials';
import { tn } from '../../support/helpers/tests-names';
import { assert } from '../../support/test-utils/assert/assert';
import { generateDocuments } from '../../fixtures/document/generate-documents';
import { interact } from '../../support/test-utils/interact/interact';

const bootstrap = () => {
  const treeConfig = {
    nodesPerLevel: [[2], [2], [1]],
  };
  const docAsts = generateDocuments({
    numberOfDocuments: 2,
    treeConfig,
  });
  const newNodeAttributes = {
    name: 'new name',
    icon: 48,
    color: '#ff0fff',
    isBold: true,
  };

  return { docAsts, newNodeAttributes };
};
describe('create document > create nodes > dnd > edit', () => {
  const {
    docAsts: [docAst],
    newNodeAttributes,
  } = bootstrap();

  before(() => {
    puppeteer.auth.signIn(users.user0);
    puppeteer.manage.deleteDocuments([], true);
  });

  it(tn.p.createDocument(docAst), () => {
    puppeteer.manage.createDocument(docAst);
  });

  it(tn.a.docContent(docAst), () => {
    assert.documentContent(docAst);
  });

  it('perform: dnd node', () => {
    interact.tree.dndNode(docAst);
  });

  it(tn.a.docContent(docAst), () => {
    assert.documentContent(docAst);
  });

  it('perform: delete node', () => {
    puppeteer.content.nodeMeta.delete({
      tree: docAst.tree,
      nodeCoordinates: [0, 0],
    });
  });

  it(tn.a.docContent(docAst), () => {
    assert.documentContent(docAst);
  });

  it('perform: edit node meta', () => {
    puppeteer.content.nodeMeta.edit({
      editedNode: docAst.tree[0][0],
      newAttributes: newNodeAttributes,
    });
  });

  it(tn.a.docContent(docAst), () => {
    assert.documentContent(docAst);
  });

  it('perform: save document', () => {
    cy.findByTestId(testIds.toolBar__main__saveDocument).click();
    cy.contains('Document saved', { timeout: 10000 });
  });

  it(tn.a.docContent(docAst), () => {
    assert.documentContent(docAst);
  });
});
