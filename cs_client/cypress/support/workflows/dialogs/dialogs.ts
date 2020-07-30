import { createNode } from './helpers/node/create';
import { edit } from './helpers/node/edit';
import { deleteNode } from './helpers/node/delete';
import { showDocumentsList } from './helpers/documents-list/interact/show';
import { close } from './helpers/documents-list/interact/close';
import { showDocumentMetaDialog } from './helpers/documents-list/interact/show-document-meta-dialog';
import { getDocumentInfo } from './helpers/documents-list/inspect/get-document-info';
import { showImportDocument } from './helpers/import-document/show';
import { DocumentAst } from '../../../fixtures/document/generate-document';
import {
  applyDocumentMeta,
  setDocumentName,
} from './helpers/document/interact/helpers';
import { Privacy } from '../../../../types/graphql/generated';
import { testIds } from '../../helpers/test-ids';
import { GuestAst } from '../document/helpers/document/set-document-privacy';

export const getDocumentSelector = (docAst: DocumentAst): string => {
  return docAst.meta.id
    ? docAst.meta.id
    : `${docAst.meta.unsaved ? '*' : ''}${docAst.meta.name}`;
};

const dialogs = {
  importDocument: {
    show: showImportDocument,
  },
  nodeMeta: {
    create: createNode,
    edit,
    delete: deleteNode,
  },
  documentMeta: {
    setName: setDocumentName,
    // create: createDocument,
    show: showDocumentMetaDialog,
    apply: applyDocumentMeta,
    setPrivacy(privacy: Privacy) {
      cy.findByTestId(testIds.documentMeta__documentPrivacy).select(privacy);

      // cy.findByText(privacy.toLowerCase().replace('_', ' ')).click();
    },
    getGuestLabel(email: string) {
      return cy
        .findByTestId(testIds.documentMeta__guestList)
        .findByText(email)
        .findByTestId(testIds.documentMeta__guestList__writeButton);
    },
    addGuest({ user: { email }, writeAccess }: GuestAst) {
      cy.findByTestId(testIds.documentMeta__addGuest__input).type(email);
      cy.findByTestId(testIds.documentMeta__addGuest__addButton).click();
      dialogs.documentMeta.getGuestLabel(email);
      if (writeAccess) {
        dialogs.documentMeta.getGuestLabel(email).click();
      }
    },
  },
  documentsList: {
    show: showDocumentsList,
    close,
    inspect: {
      getDocumentInfo,
      getNumberOfDocuments: () => {
        return new Cypress.Promise(res => {
          cy.get('.selectFile').then(body$ => {
            const body = body$[0];
            res(body.querySelectorAll('.selectFile__file__name').length);
          });
        });
      },
    },
    selectDocument(docAst: DocumentAst) {
      cy.findByText(getDocumentSelector(docAst)).click();
    },
  },
};

export { dialogs };
