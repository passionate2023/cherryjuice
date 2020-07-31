import { puppeteer } from '../../support/workflows/document/puppeteer';
import { tn } from '../../support/workflows/tests-names';
import { assert } from '../../support/test-utils/assert/assert';
import { users } from '../../fixtures/auth/login-credentials';
import { inspect } from '../../support/inspect/inspect';
import { generateDocuments } from '../../fixtures/document/generate-documents';

const bootstrap = () => {
  const docAsts = generateDocuments({
    numberOfDocuments: 1,
    treeConfig: {
      nodesPerLevel: [[2]],
      includeText: true,
      numberOfImages: [2, 5],
    },
  });
  return { docAsts };
};
describe('create document > create nodes', () => {
  const {
    docAsts: [docAst],
  } = bootstrap();

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
