import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { wait } from '../../../../helpers/cypress-helpers';
import { testIds } from '../../../../helpers/test-ids';
import { interact } from '../../../interact/interact';

export const deleteDocuments = (
  documentsToDelete: DocumentAst[],
  deleteAll?: boolean,
  options = { closeDocumentsList: true },
) => {
  interact.documentsList.show();
  wait.ms500();
  cy.document().then(document => {
    const files = document.querySelectorAll('.dialog-list-item');
    if (files.length > 0) {
      cy.findByTestId(
        testIds.dialogs__selectDocument__header__buttons__deleteSweep,
        {},
      ).click();
      if (deleteAll) {
        cy.findByTestId(
          testIds.dialogs__selectDocument__header__buttons__deleteAll,
        ).click();
      } else
        documentsToDelete.forEach(document => {
          cy.findByText(document.meta.id).click();
        });
      cy.findByTestId(
        testIds.dialogs__selectDocument__header__buttons__delete,
      ).click();
      cy.findByTestId(testIds.modal__deleteDocument__confirm).click();
      wait.s1;
    }
  });
  if (options.closeDocumentsList) interact.documentsList.close();
};
