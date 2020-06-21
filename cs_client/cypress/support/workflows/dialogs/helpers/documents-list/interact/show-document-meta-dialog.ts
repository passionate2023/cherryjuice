import { wait } from '../../../../../helpers/cypress-helpers';
import { dialogs } from '../../../dialogs';

const showDocumentMetaDialog = (documentName: string) => {
  dialogs.documentsList.interact.show();
  wait.s1();
  cy.findByText(documentName)
    .parent()
    .find('.selectFile__file__three-dots-button')
    .click();
  cy.findByText(documentName)
    .parent()
    .find('.selectFile__file__three-dots-popup__item')
    .click();
};

export { showDocumentMetaDialog };
