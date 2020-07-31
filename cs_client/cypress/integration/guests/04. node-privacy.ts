import { generateDocuments } from '../../fixtures/document/generate-documents';
import { NodePrivacy, Privacy } from '../../../types/graphql/generated';
import { users } from '../../fixtures/auth/login-credentials';
import { fixScrolling } from '../../support/helpers/cypress-helpers';
import { puppeteer } from '../../support/workflows/document/puppeteer';
import { tn } from '../../support/workflows/tests-names';
import { assert } from '../../support/test-utils/assert/assert';
import { GuestAst } from '../../support/workflows/document/helpers/document/set-document-privacy';

export type DocumentPrivacy = { privacy: Privacy; guests: GuestAst[] };
const bootstrap = () => {
  const treeConfig = {
    nodesPerLevel: [[1], [1], [1], [1]],
    includeText: false,
    randomStyle: false,
  };
  const docAsts = generateDocuments({
    numberOfDocuments: 1,
    privacy: Privacy.PUBLIC,
    treeConfig,
  });
  const docsPrivacy: DocumentPrivacy[] = [
    {
      privacy: Privacy.GUESTS_ONLY,
      guests: [{ user: users.user1, writeAccess: false }],
    },
  ];
  const nodesPrivacy = [
    {
      nodeCoordinates: [3, 0],
      editedAttributes: {
        privacy: NodePrivacy.PRIVATE,
      },
    },
    {
      nodeCoordinates: [2, 0],
      editedAttributes: {
        privacy: NodePrivacy.DEFAULT,
      },
    },
    {
      nodeCoordinates: [1, 0],
      editedAttributes: {
        privacy: NodePrivacy.GUESTS_ONLY,
      },
    },
  ];
  return { docAsts, docsPrivacy, nodesPrivacy };
};

describe('node privacy', () => {
  const { docAsts, docsPrivacy, nodesPrivacy } = bootstrap();

  // delete all documents of the user
  before(() => {
    fixScrolling();
    cy.log('delete all documents of the user');
    puppeteer.auth.signIn(users.user0);
    puppeteer.manage.deleteDocuments([], true);
  });

  // create public document with 4 nodes
  docAsts.forEach(docAst => {
    it(tn.p.createDocument(docAst), () => {
      puppeteer.manage.createDocument(docAst);
    });
  });

  // save the document
  it(tn.p.saveDocuments(), () => {
    puppeteer.manage.saveDocument(docAsts);
  });

  // assert all nodes are showing in public mode
  docAsts.forEach(docAst => {
    it(tn.a.documentPrivacy(docAst), () => {
      assert.documentPrivacy(docAst);
    });
  });

  // set each node privacy gradually
  /*
  default
  guests
  default
  private
  */
  it(tn.p.mutateDocumentText(docAsts[0], users.user0), () => {
    const user = users.user0;
    const docAst = docAsts[0];
    puppeteer.auth.signIn(user);
    puppeteer.navigate.goToDocument(docAst);
    puppeteer.content.editTree(docAst, nodesPrivacy);
  });

  // save the document
  it(tn.p.saveDocuments(), () => {
    puppeteer.manage.saveDocument(docAsts);
  });

  // assert only 1st node is visible
  docAsts.forEach(docAst => {
    it(tn.a.documentPrivacy(docAst), () => {
      assert.documentPrivacy(docAst);
    });
  });

  // set document privacy to guests
  docsPrivacy.forEach((privacySetting, i) => {
    it(tn.p.setDocumentPrivacy(docAsts[i], privacySetting.privacy), () => {
      const docAst = docAsts[i];
      puppeteer.auth.signIn(users.user0);
      puppeteer.manage.selectDocument(docAst);
      puppeteer.manage.setDocumentPrivacy(docAst, privacySetting);
      puppeteer.manage.saveDocument(docAsts);
    });
  });

  // assert that 3 nodes are visible to guest
  docsPrivacy[0].guests.forEach(guest => {
    const docAst = docAsts[0];
    it(tn.docIsAvaiToGuest(docAst, guest), () => {
      assert.documentIsAvailableToGuest(docAst, guest);
    });
  });
});
