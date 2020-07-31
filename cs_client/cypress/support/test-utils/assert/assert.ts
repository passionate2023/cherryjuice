import { DocumentAst } from '../../../fixtures/document/generate-document';
import { assertRichText } from './document/assert-rich-text/assert-rich-text';
import { assertTree } from './document/assert-tree/assert-tree';
import { assertDocumentPrivacy } from './privacy/assertions/assert-document-privacy';
import { assertReadMode } from './privacy/assertions/assert-read-mode';
import { assertWriteMode } from './privacy/assertions/assert-write-mode';
import { assertDocIsAvailableToGuest } from './privacy/assertions/assert-doc-is-available-to-guest';
import { assertDocIsAvailableToAuthnUser } from './privacy/assertions/assert-doc-is-available-to-authn-user';
import { assertGuestHasNDocuments } from './privacy/assertions/asssert-guest-has-n-documents';
import { assertDocIsNotAvailableToGuest } from './privacy/assertions/assert-doc-is-not-available-to-guest';

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
