import { generateDocuments } from '../../fixtures/document/generate-documents';
import { Privacy } from '../../../types/graphql';
import { puppeteer } from '../../support/test-utils/puppeteer/puppeteer';
import { users } from '../../fixtures/auth/login-credentials';
import { tn } from '../../support/helpers/tests-names';
import { assert } from '../../support/test-utils/assert/assert';
import { fixScrolling } from '../../support/helpers/cypress-helpers';

const bootstrap = () => {
  const treeConfig = {
    includeText: false,
    nodesPerLevel: [[1]],
    randomStyle: false,
  };
  const docAsts = generateDocuments({
    numberOfDocuments: 2,
    treeConfig,
  });
  const docsPrivacy = [
    {
      privacy: Privacy.PUBLIC,
      guests: [],
    },
  ];
  return { docAsts, docsPrivacy };
};
describe('public documents', () => {
  const { docAsts, docsPrivacy } = bootstrap();

  // delete all documents of the user
  before(() => {
    fixScrolling();
    cy.log('delete all documents of the user');
    puppeteer.auth.signIn(users.user0);
    puppeteer.manage.deleteDocuments([], true);
  });

  // create 2 private documents
  docAsts.forEach(docAst => {
    it(tn.p.createDocument(docAst), () => {
      puppeteer.manage.createDocument(docAst);
    });
  });

  // save the documents
  it(tn.p.saveDocuments(), () => {
    puppeteer.manage.saveDocument(docAsts);
  });

  // assert both documents are private
  docAsts.forEach(docAst => {
    it(tn.a.documentPrivacy(docAst), () => {
      assert.documentPrivacy(docAst);
    });
  });

  // set doc0 privacy to public
  docsPrivacy.forEach((privacySetting, i) => {
    const docAst = docAsts[i];
    it(tn.p.setDocumentPrivacy(docAst, privacySetting.privacy), () => {
      puppeteer.auth.signIn(users.user0);
      puppeteer.manage.selectDocument(docAst);
      puppeteer.manage.setDocumentPrivacy(docAst, privacySetting);
      puppeteer.manage.saveDocument(docAsts);
    });
  });

  // mutate content of public document by the owner
  it(tn.p.mutateDocumentText(docAsts[0], users.user0), () => {
    const docAst = docAsts[0];
    puppeteer.auth.signIn(users.user0);
    puppeteer.manage.selectDocument(docAst);
    docAst.tree[0][0].text += `this text is added by user ${users.user0.username}`;
    puppeteer.content.setDocumentText(docAst, true);
    puppeteer.manage.saveDocument(docAsts);
  });

  // assert doc0 is public and doc1 is private
  docAsts.forEach((docAst, i) => {
    it(tn.a.documentPrivacy(docAst, docsPrivacy[i]?.privacy), () => {
      assert.documentPrivacy(docAst);
    });
  });

  // assert a different user can access the file, but can't edit it
  it(tn.a.publicDocumentIsAvailableToAuthUser(docAsts[0], users.user1), () => {
    const docAst = docAsts[0];
    assert.publicDocumentIsAvailableToAuthUser(docAst, users.user1);
  });

  // set doc0 privacy from public to private
  it(tn.p.setDocumentPrivacy(docAsts[0], Privacy.PRIVATE), () => {
    const docAst = docAsts[0];
    puppeteer.auth.signIn(users.user0);
    puppeteer.manage.selectDocument(docAst);
    puppeteer.manage.setDocumentPrivacy(docAst, {
      privacy: Privacy.PRIVATE,
      guests: [],
    });
    puppeteer.manage.saveDocument(docAsts);
  });

  // assert both documents are private
  docAsts.forEach(docAst => {
    it(tn.a.documentPrivacy(docAst), () => {
      assert.documentPrivacy(docAst);
    });
  });
});
