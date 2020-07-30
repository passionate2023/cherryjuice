import { generateDocument } from '../fixtures/document/generate-document';
import { puppeteer } from '../support/workflows/document/puppeteer';
import { tn } from '../support/workflows/tests-names';
import { assert } from '../support/assertions/assertions';
import { users } from '../fixtures/auth/login-credentials';
import { inspect } from '../support/inspect/inspect';

const docAst = generateDocument({
  treeConfig: {
    nodesPerLevel: [[2]],
    includeText: true,
    numberOfImages: [2, 5],
  },
  documentConfig: {
    name: new Date().toString(),
  },
});

describe('create document > create nodes', () => {
  before(() => {
    puppeteer.auth.signIn(users.user0);
  });

  it(tn.p.createDocument(docAst), () => {
    puppeteer.manage.createDocument(docAst);
  });
  it(tn.a.docContent(docAst), () => {
    assert.documentContent(docAst);
  });

  it(tn.p.saveDocuments(), () => {
    puppeteer.manage.saveDocument([docAst]);
    inspect.assignDocumentHashAndIdToAst([docAst]);
  });
  it(tn.a.docContent(docAst), () => {
    assert.documentContent(docAst);
  });

  it('perform: write additional image', () => {
    puppeteer.auth.signIn(users.user0);
    puppeteer.manage.selectDocument(docAst);
    puppeteer.content.addImages(docAst);
  });

  it(tn.a.docContent(docAst), () => {
    assert.documentContent(docAst);
  });

  it(tn.p.saveDocuments(), () => {
    puppeteer.manage.saveDocument([docAst]);
    inspect.assignDocumentHashAndIdToAst([docAst]);
  });
  it(tn.a.docContent(docAst), () => {
    assert.documentContent(docAst);
  });
});
