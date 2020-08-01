import { puppeteer } from '../../support/test-utils/puppeteer/puppeteer';
import { users } from '../../fixtures/auth/login-credentials';
import { tn } from '../../support/helpers/tests-names';
import { assert } from '../../support/test-utils/assert/assert';
import { inspect } from '../../support/test-utils/inspect/inspect';
import { generateDocuments } from '../../fixtures/document/generate-documents';

const bootstrap = () => {
  const treeConfig = {
    nodesPerLevel: [[2]],
    includeText: true,
    randomStyle: false,
  };
  const docAsts = generateDocuments({
    numberOfDocuments: 2,
    treeConfig,
  });

  return { docAsts };
};

describe('export-import', function() {
  const { docAsts } = bootstrap();

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
  it('perform: export document', () => {
    puppeteer.io.exportDocument(docAsts[1], users.user0);
  });

  it('perform: import and open exported document', () => {
    const document = docAsts[1];
    puppeteer.io.importLocalFile({
      suffix: 'exported',
      extension: 'ctb',
      name: `${document.meta.name}`,
    });
  });
  it('assert: exported document content', () => {
    assert.documentContent(docAsts[1]);
  });
});
