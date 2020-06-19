import { wait } from '../../helpers/cypress-helpers';
import { testIds } from '../../helpers/test-ids';

export const documentList = {
  close: () => {
    cy.findByTestId('close-document-select', { timeout: 20000 }).click();
    wait.ms500();
  },
  show: () => {
    cy.findByTestId(testIds.toolBar__navBar__showDocumentList).click();
    wait.ms500();
  },
  getDocumentHashAndId: (
    documentName: string,
    id?: string,
  ): Promise<{ id: string; hash: string }> =>
    new Cypress.Promise(res => {
      cy.findByText(id || documentName)
        .parent()
        .then(parent$ => {
          const parent = parent$[0];
          const hashElement: HTMLSpanElement = parent.querySelector(
            '.selectFile__file__details__hash',
          );
          const idElement: HTMLSpanElement = parent.querySelector(
            '.selectFile__file__details__id',
          );
          res({ id: idElement.innerText, hash: hashElement.innerText });
        });
    }),
  showRenameDocumentDialog: (documentName: string) => {
    documentList.show();
    wait.s1();
    cy.findByText(documentName)
      .parent()
      .find('.selectFile__file__three-dots-button')
      .click();
    cy.findByText(documentName)
      .parent()
      .find('.selectFile__file__three-dots-popup__item')
      .click();
  },
};
