import { assertNodeText } from '../support/assertions/content/node-text';
import { dialogs } from '../support/workflows/dialogs/dialogs';
import { puppeteer } from '../support/workflows/document/puppeteer';
import { generateDocuments } from '../fixtures/document/generate-documents';
import { users } from '../fixtures/auth/login-credentials';
import { tn } from '../support/workflows/tests-names';
import { assert } from '../support/assertions/assertions';
import { inspect } from '../support/inspect/inspect';

describe('create document > edit-document > delete-document', () => {
  const treeConfig = {
    nodesPerLevel: [[1]],
    includeText: true,
    randomStyle: false,
  };
  const docAsts = generateDocuments({
    numberOfDocuments: 2,
    treeConfig,
  });

  const additionalDocuments = generateDocuments({
    numberOfDocuments: 1,
    treeConfig,
  });

  before(() => {
    puppeteer.auth.signIn(users.user0);
    puppeteer.manage.deleteDocuments([], true);
  });

  docAsts.forEach(docAst => {
    it(tn.p.createDocument(docAst), () => {
      puppeteer.manage.createDocument(docAst);
    });
  });

  it(tn.p.saveDocuments(), () => {
    puppeteer.manage.saveDocument(docAsts);
    inspect.assignDocumentHashAndIdToAst(docAsts);
  });

  it('assert: each document has unique hash', () => {
    expect(docAsts[0].meta.hash).to.not.be.empty;
    expect(docAsts[1].meta.hash).to.not.be.empty;
    expect(docAsts[0].meta.hash).to.not.equal(docAsts[1].meta.hash);
  });

  docAsts.forEach(docAst => {
    it(tn.a.docContent(docAst), () => {
      assert.documentContent(docAst);
    });
  });

  it('perform: rename document', () => {
    const docAst = docAsts[0];
    const newName = docAsts[1].meta.name;
    puppeteer.auth.signIn(users.user0);
    puppeteer.navigate.goToDocument(docAst);
    puppeteer.manage.renameDocument(docAst, newName);
  });

  it(tn.p.saveDocuments(), () => {
    puppeteer.manage.saveDocument(docAsts);
    inspect.assignDocumentHashAndIdToAst(docAsts);
  });

  it('assert: documents have same hash', () => {
    expect(docAsts[0].meta.hash).to.equal(docAsts[1].meta.hash);
  });

  additionalDocuments.forEach(docAst => {
    it(tn.p.createDocument(docAst), () => {
      puppeteer.manage.createDocument(docAst);
    });
  });

  it('perform: get documents hash', () => {
    inspect.assignDocumentHashAndIdToAst(additionalDocuments);
  });
  it('perform: delete saved and unsaved documents', () => {
    puppeteer.manage.deleteDocuments([docAsts[0], additionalDocuments[0]]);
  });
  it('assert: delete saved and unsaved documents', () => {
    cy.get('.selectFile__file__name ').then(documents => {
      expect(documents.length).to.be.equal(1);
    });
    dialogs.documentsList.close();
  });
  it('perform: export document', () => {
    puppeteer.io.exportDocument(docAsts[1], users.user0);
  });

  it('perform: import and open exported document', () => {
    const document = docAsts[1];
    puppeteer.io.importLocalFile({
      suffix: 'exported',
      extension: 'ctb',
      name: `${document.meta.name}`,
      tempSubFolder: new Date().getTime().toString(),
    });
  });
  it('assert: imported document content', () => {
    const document = docAsts[1];
    document.tree[0].forEach(node => {
      assertNodeText({ node, text: node.text });
    });
  });
});
