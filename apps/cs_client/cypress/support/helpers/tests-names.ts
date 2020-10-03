import { UserCredentials } from '../../fixtures/auth/login-credentials';
import { DocumentAst } from '../../fixtures/document/generate-document';
import { GuestAst } from '../test-utils/puppeteer/epics/document/set-document-privacy';
import { Privacy } from '@cherryjuice/graphql-types';

export const tn = {
  p: {
    createDocument: (docAst: DocumentAst) =>
      `perform: create document[${docAst.meta.name}]`,
    saveDocuments: () => 'perform: save documents',
    setDocumentPrivacy: (docAst: DocumentAst, privacy: Privacy) =>
      `perform: set document[${docAst.meta.name}].privacy to ${privacy}`,
    mutateDocumentText: (docAst: DocumentAst, user: UserCredentials) =>
      `perform: write document[${docAst.meta.name}] nodes text by user ${user.username}`,
  },
  a: {
    docContent(docAst: DocumentAst) {
      return 'assert: document ' + docAst.meta.name + ' content';
    },
    documentPrivacy(docAst: DocumentAst, newPrivacy?: Privacy) {
      const privacy = newPrivacy || docAst.meta.privacy;
      if (privacy === Privacy.PRIVATE) return tn.docIsNotPublic(docAst);
      else if (privacy === Privacy.PUBLIC) return tn.docIsPublic(docAst);
      else if (privacy === Privacy.GUESTS_ONLY) {
        return tn.docIsNotPublic(docAst);
      }
    },
    publicDocumentIsAvailableToAuthUser(
      documentAst: DocumentAst,
      user: UserCredentials,
    ) {
      return `assert: user[${user.email}] can access public document ${documentAst.meta.name}`;
    },
    guestCantDeleteDocument(docAst: any, user: UserCredentials) {
      return `assert: user[${user.email}] (w guest) can not delete  document ${docAst.meta.name}`;
    },
  },

  docIsAvaiToGuest: (docAst: DocumentAst, guest: GuestAst) =>
    `assert: document ${docAst.meta.name} is available to ${
      guest.writeAccess ? 'W' : 'R'
    } ${guest.user.email}`,
  docIsNotAvaiToGuest: (docAst: DocumentAst, guest: GuestAst) =>
    `assert: document ${docAst.meta.name} is NOT available to ${
      guest.writeAccess ? 'W' : 'R'
    } ${guest.user.email}`,
  docIsNotPublic: (docAst: DocumentAst) =>
    'assert: document ' + docAst.meta.name + ' is not public',
  addRGuest: (documentAst: DocumentAst, user: UserCredentials) =>
    `perform: add user[${user.email}] as R guest to ${documentAst.meta.name}`,
  addWGuest: (documentAst: DocumentAst, user: UserCredentials) =>
    `perform: add user[${user.email}] as W guest to ${documentAst.meta.name}`,
  setDocPriv: (docAst: DocumentAst) =>
    `perform: set document[${docAst.meta.name}].privacy to ${docAst.meta.privacy}`,
  docIsPublic: (docAst: DocumentAst) =>
    'assert: document ' + docAst.meta.name + ' is public',
  docsAreAvaiToGuest(n: number, guest: GuestAst) {
    return `assert: ${n} documents are available to ${guest.user.username}`;
  },
};
