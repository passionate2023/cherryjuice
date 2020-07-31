import { generateDocuments } from '../../fixtures/document/generate-documents';
import { Privacy } from '../../../types/graphql/generated';
import { users } from '../../fixtures/auth/login-credentials';
import { fixScrolling } from '../../support/helpers/cypress-helpers';
import { puppeteer } from '../../support/workflows/document/puppeteer';
import { tn } from '../../support/workflows/tests-names';
import { assert } from '../../support/test-utils/assert/assert';

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
      privacy: Privacy.GUESTS_ONLY,
      guests: [{ user: users.user1, writeAccess: false }],
    },
  ];
  return { docAsts, docsPrivacy };
};

describe('read guest', () => {
  const { docAsts, docsPrivacy } = bootstrap();

  // delete all documents of the user
  before(() => {
    fixScrolling();
    cy.log('delete all documents of the user');
    puppeteer.auth.signIn(users.user0);
    puppeteer.manage.deleteDocuments([], true);
  });

  // create 2 documents
  docAsts.forEach(docAst => {
    it(tn.p.createDocument(docAst), () => {
      puppeteer.manage.createDocument(docAst);
    });
  });

  // save the documents
  it(tn.p.saveDocuments(), () => {
    puppeteer.manage.saveDocument(docAsts);
  });

  // set doc0 to g-only > add user1 as guest
  docsPrivacy.forEach((privacySetting, i) => {
    it(tn.p.setDocumentPrivacy(docAsts[i], privacySetting.privacy), () => {
      const docAst = docAsts[i];
      puppeteer.auth.signIn(users.user0);
      puppeteer.manage.selectDocument(docAst);
      puppeteer.manage.setDocumentPrivacy(docAst, privacySetting);
      puppeteer.manage.saveDocument(docAsts);
    });
  });

  // assert doc 0 and doc1 is private for incognito users
  docAsts.forEach((docAst, i) => {
    it(tn.a.documentPrivacy(docAst, docsPrivacy[i]?.privacy), () => {
      assert.documentPrivacy(docAst);
    });
  });

  // assert doc0 s available for user1 in r mode
  docsPrivacy[0].guests.forEach(guest => {
    const docAst = docAsts[0];
    it(tn.docIsAvaiToGuest(docAst, guest), () => {
      assert.documentIsAvailableToGuest(docAst, guest);
    });

    it(tn.docsAreAvaiToGuest(1, guest), () => {
      assert.guestHasTheRightDocuments(1, guest.user);
    });
  });

  // make doc0 private
  it(tn.p.setDocumentPrivacy(docAsts[0], Privacy.PRIVATE), () => {
    const docAst = docAsts[0];
    puppeteer.auth.signIn(users.user0);
    docAst.meta.privacy = Privacy.PRIVATE;
    puppeteer.manage.selectDocument(docAst);
    puppeteer.manage.setDocumentPrivacy(docAst, {
      privacy: Privacy.PRIVATE,
      guests: [],
    });
    puppeteer.manage.saveDocument(docAsts);
  });

  // assert doc0 is private
  docAsts.forEach((docAst, i) => {
    it(tn.a.documentPrivacy(docAst, docsPrivacy[i]?.privacy), () => {
      assert.documentPrivacy(docAst);
    });
  });

  // assert doc0 is not available for guests
  docsPrivacy[0].guests.forEach(guest => {
    const docAst = docAsts[0];
    it(tn.docIsNotAvaiToGuest(docAst, guest), () => {
      assert.documentIsNotAvailableToGuest(docAst, guest);
    });

    it(tn.docsAreAvaiToGuest(0, guest), () => {
      assert.guestHasTheRightDocuments(0, guest.user);
    });
  });
});
