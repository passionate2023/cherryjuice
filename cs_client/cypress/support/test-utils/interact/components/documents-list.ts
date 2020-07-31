import { wait } from '../../../helpers/cypress-helpers';
import { testIds } from '../../../helpers/test-ids';
import { DocumentAst } from '../../../../fixtures/document/generate-document';

const show = () => {
  cy.findByTestId(testIds.toolBar__navBar__showDocumentList, {
    timeout: 20000,
  }).click({ force: true });
  wait.s1;
};

const close = () => {
  cy.get('body').type('{esc}');
  wait.s1;
};

const select = {
  document(docAst: DocumentAst) {
    cy.findByText(docAst.meta.id).click();
  },
};

export const documentsList = {
  show,
  close,
  select,
};
