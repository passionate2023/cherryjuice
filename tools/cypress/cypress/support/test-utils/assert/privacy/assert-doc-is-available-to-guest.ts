import { DocumentAst } from '../../../../fixtures/document/generate-document';
import { GuestAst } from '../../puppeteer/epics/document/set-document-privacy';
import { puppeteer } from '../../puppeteer/puppeteer';
import { assert } from '../assert';

export const assertDocIsAvailableToGuest = (
  docAst: DocumentAst,
  guest: GuestAst,
) => {
  puppeteer.auth.signIn(guest.user, false);
  puppeteer.navigate.goToDocument(docAst);
  assert.documentContent(docAst);
  if (!guest.writeAccess) assert.assertRMode();
  else {
    assert.assertWMode();
  }
  puppeteer.auth.signOut();
};
