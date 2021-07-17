import { DocumentAst } from '../../../fixtures/document/generate-document';
import { assertRichText } from './document/assert-rich-text/assert-rich-text';
import { assertTree } from './document/assert-tree/assert-tree';
import { assertDocumentPrivacy } from './privacy/assert-document-privacy';
import { assertReadMode } from './privacy/assert-read-mode';
import { assertWriteMode } from './privacy/assert-write-mode';
import { assertDocIsAvailableToGuest } from './privacy/assert-doc-is-available-to-guest';
import { assertDocIsAvailableToAuthnUser } from './privacy/assert-doc-is-available-to-authn-user';
import { assertGuestHasNDocuments } from './privacy/asssert-guest-has-n-documents';
import { assertDocIsNotAvailableToGuest } from './privacy/assert-doc-is-not-available-to-guest';

export const assert = {
  documentPrivacy: assertDocumentPrivacy,
  documentContent: (docAst: DocumentAst) => {
    assertTree(docAst);
    assertRichText(docAst);
  },
  assertRMode: assertReadMode,
  assertWMode: assertWriteMode,
  documentIsAvailableToGuest: assertDocIsAvailableToGuest,
  publicDocumentIsAvailableToAuthUser: assertDocIsAvailableToAuthnUser,
  guestHasTheRightDocuments: assertGuestHasNDocuments,
  documentIsNotAvailableToGuest: assertDocIsNotAvailableToGuest,
};
