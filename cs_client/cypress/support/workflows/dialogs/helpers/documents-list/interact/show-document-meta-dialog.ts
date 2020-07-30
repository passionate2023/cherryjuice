import { wait } from '../../../../../helpers/cypress-helpers';
import { dialogs } from '../../../dialogs';
import { DocumentAst } from '../../../../../../fixtures/document/generate-document';

const showDocumentMetaDialog = (docAst: DocumentAst) => {
  const selector = docAst.meta.id; //getDocumentSelector(docAst);
  dialogs.documentsList.show();
  cy.findByText(selector)
    .parent()
    .parent()
    .parent()
    .debug()
    .find('.selectFile__file__three-dots-button')
    .click();
  cy.findByText(selector)
    .parent()
    .parent()
    .parent()
    .find('.selectFile__file__three-dots-popup__item')
    .first()
    .click();
  wait.ms500();
};

export { showDocumentMetaDialog };
