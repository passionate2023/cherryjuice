import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { dialogs } from '../../../dialogs/dialogs';
import { wait } from '../../../../helpers/cypress-helpers';
import { testIds } from '../../../../helpers/test-ids';

export const deleteDocuments = (
  documentsToDelete: DocumentAst[],
  deleteAll?: boolean,
  options = { closeDocumentsList: true },
) => {
  dialogs.documentsList.show();
  wait.s1;
  cy.document().then(document => {
    const files = document.querySelectorAll('.selectFile__file__name');
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
      wait.s1;
      wait.s1;
    }
  });
  if (options.closeDocumentsList) dialogs.documentsList.close();
};
