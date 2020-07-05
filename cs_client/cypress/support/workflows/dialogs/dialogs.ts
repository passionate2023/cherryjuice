import { createNode } from './helpers/node/create';
import { edit } from './helpers/node/edit';
import { deleteNode } from './helpers/node/delete';
import { showDocumentsList } from './helpers/documents-list/interact/show';
import { close } from './helpers/documents-list/interact/close';
import { showDocumentMetaDialog } from './helpers/documents-list/interact/show-document-meta-dialog';
import { getDocumentInfo } from './helpers/documents-list/inspect/get-document-info';
import { createDocument } from './helpers/document/interact/create';
import { renameDocument } from './helpers/document/interact/rename';
import { showImportDocument } from './helpers/import-document/show';

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
    create: createDocument,
    rename: renameDocument,
  },
  documentsList: {
    show: showDocumentsList,
    close,
    showDocumentMetaDialog,
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
  },
};

export { dialogs };
