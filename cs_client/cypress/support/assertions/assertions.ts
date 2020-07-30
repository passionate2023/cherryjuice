import { DocumentAst } from '../../fixtures/document/generate-document';
import { puppeteer } from '../workflows/document/puppeteer';
import { assertNodesName } from './nodes-name';
import { assertTreeStructure } from './tree-structure';
import { assertDocumentImages, assertDocumentText } from './content/node-text';
import { testIds } from '../helpers/test-ids';
import { GuestAst } from '../workflows/document/helpers/document/set-document-privacy';
import { dialogs } from '../workflows/dialogs/dialogs';
import { wait } from '../helpers/cypress-helpers';
import { Privacy } from '../../../types/graphql/generated';
import { documentIsPrivate, documentIsPublic } from './helpers/privacy';
import { UserCredentials } from '../../fixtures/auth/login-credentials';

export const assert = {
  documentPrivacy: (docAst: DocumentAst) => {
    if (docAst.meta.privacy === Privacy.PRIVATE) {
      documentIsPrivate(docAst);
    } else if (docAst.meta.privacy === Privacy.PUBLIC) documentIsPublic(docAst);
    else if (docAst.meta.privacy === Privacy.GUESTS_ONLY)
      documentIsPrivate(docAst);
  },

  documentContent: (docAst: DocumentAst) => {
    assertNodesName(docAst);
    assertTreeStructure(docAst);
    assertDocumentText(docAst);
    assertDocumentImages(docAst);
  },
  assertRMode() {
    cy.document().then(document => {
      const formattingButton = document.querySelector(
        `[data-testid="${testIds.toolBar__main__editNodeMeta}"]`,
      );
      const showDocuments = document.querySelector(
        `[data-testid="${testIds.toolBar__navBar__showDocumentList}"]`,
      );
      expect(showDocuments).to.exist;
      expect(formattingButton).to.not.exist;
    });
  },
  assertWMode() {
    cy.document().then(document => {
      const formattingButton = document.querySelector(
        `[data-testid="${testIds.toolBar__main__editNodeMeta}"]`,
      );
      const showDocuments = document.querySelector(
        `[data-testid="${testIds.toolBar__navBar__showDocumentList}"]`,
      );
      expect(showDocuments).to.exist;
      expect(formattingButton).to.exist;
    });
  },
  documentIsAvailableToGuest: (docAst: DocumentAst, guest: GuestAst) => {
    puppeteer.auth.signIn(guest.user, false);
    // puppeteer.manage.selectDocument(docAst);
    puppeteer.navigate.goToDocument(docAst);
    assert.documentContent(docAst);
    if (!guest.writeAccess) assert.assertRMode();
    else {
      assert.assertWMode();
    }
    puppeteer.auth.signOut();
  },
  publicDocumentIsAvailableToAuthUser: (
    docAst: DocumentAst,
    user: UserCredentials,
  ) => {
    puppeteer.auth.signIn(user, false);
    puppeteer.navigate.goToDocument(docAst);
    assert.documentContent(docAst);
    assert.assertRMode();
    assert.guestHasTheRightDocuments(0, user);
    puppeteer.auth.signOut();
  },
  guestHasTheRightDocuments(nOfDocuments: number, user: UserCredentials) {
    puppeteer.auth.signIn(user, false);
    dialogs.documentsList.show();
    wait.s1;
    dialogs.documentsList.inspect.getNumberOfDocuments().then(n => {
      expect(n).to.equal(nOfDocuments);
    });
    dialogs.documentsList.close();
  },
  documentIsNotAvailableToGuest(
    docAst: DocumentAst,
    { user }: { writeAccess: boolean; user: UserCredentials },
  ) {
    puppeteer.auth.signIn(user, false);
    cy.visit('/');
    wait.s1;
    cy.visit(`/document/${docAst.meta.id}`);
    cy.contains('does not exist in your library', { timeout: 20000 });
  },
};
