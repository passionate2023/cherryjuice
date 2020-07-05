import { createTree } from './helpers/tree/create-tree';
import { importLocalFile } from './helpers/import/import-local-file';
import { login } from '../login';
import { goHome } from '../navigate-home';
import { dialogs } from '../dialogs/dialogs';
import { fixScrolling, wait } from '../../helpers/cypress-helpers';
import { testIds } from '../../helpers/test-ids';
import { DocumentAst } from '../../../fixtures/document/generate-document';

const documentPuppeteer = {
  goToHomeScreen: () => {
    fixScrolling();
    cy.visit(`/`);
    login();
    goHome();
    dialogs.documentsList.close();
  },
  importLocalFile,
  createTree,
  inspect: {
    getNumberOfDocuments: () => {
      return new Cypress.Promise(res => {
        dialogs.documentsList.show();
        dialogs.documentsList.inspect.getNumberOfDocuments().then(n => {
          dialogs.documentsList.close();
          res(n);
        });
      });
    },
    getDocumentsHash(documents: DocumentAst[]) {
      dialogs.documentsList.show();
      documents.forEach(document => {
        dialogs.documentsList.inspect
          .getDocumentInfo(document.meta)
          .then(({ id, hash }) => {
            document.meta.id = id;
            document.meta.hash = hash;
          });
      });
      dialogs.documentsList.close();
    },
  },
  saveDocument(documents: DocumentAst[]) {
    cy.findByTestId(testIds.toolBar__main__saveDocument).click();
    cy.contains('Document saved', { timeout: 10000 });
    documents.forEach(document => {
      document.meta.unsaved = false;
    });
  },
  deleteDocuments(documentsToDelete: DocumentAst[]) {
    dialogs.documentsList.show();
    cy.findByTestId(
      testIds.dialogs__selectDocument__header__buttons__deleteSweep,
    ).click();
    documentsToDelete.forEach(document => {
      cy.findByText(document.meta.id).click();
    });
    cy.findByTestId(
      testIds.dialogs__selectDocument__header__buttons__delete,
    ).click();
    wait.s1();
    wait.s1();
  },
  renameDocument(document: DocumentAst, newName: string) {
    cy.reload();
    login();
    cy.visit(`/document/${document.meta.id}`);
    dialogs.documentMeta.rename({
      currentName: document.meta.name,
      newName,
    });
    document.meta.name = newName;
  },
  goToDocument(document: DocumentAst) {
    cy.reload();
    login();
    cy.visit(`/document/${document.meta.id}`);
  },
  exportDocument(document: DocumentAst) {
    documentPuppeteer.goToDocument(document);
    cy.findByTestId(testIds.toolBar__navBar__exportDocument).click();
    cy.contains('finished');
    cy.findByTestId(
      testIds.popups__documentOperations__downloadDocument + document.meta.id,
    ).click();
    wait.s1();
    cy.findByTestId(
      testIds.popups__documentOperations__clearAllFinished,
    ).click();
  },
};

export { documentPuppeteer };
