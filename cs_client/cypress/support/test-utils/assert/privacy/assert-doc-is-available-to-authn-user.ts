import { DocumentAst } from '../../../../fixtures/document/generate-document';
import { UserCredentials } from '../../../../fixtures/auth/login-credentials';
import { puppeteer } from '../../puppeteer/puppeteer';
import { assert } from '../assert';

export const assertDocIsAvailableToAuthnUser = (
  docAst: DocumentAst,
  user: UserCredentials,
) => {
  puppeteer.auth.signIn(user, false);
  puppeteer.navigate.goToDocument(docAst);
  assert.documentContent(docAst);
  assert.assertRMode();
  assert.guestHasTheRightDocuments(0, user);
  puppeteer.auth.signOut();
};
