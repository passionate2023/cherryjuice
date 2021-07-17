import { wait } from '../../../helpers/cypress-helpers';
import { testIds } from '@cherryjuice/test-ids';
import { DocumentAst } from '../../../../fixtures/document/generate-document';
import { closeModal } from './shared';
import { interact } from '../interact';

const show = () => {
  interact.userMenu.show();
  cy.findByTestId(testIds.toolBar__navBar__showDocumentList, {
    timeout: 20000,
  }).click({ force: true });
  wait.s1;
};

const select = {
  document(docAst: DocumentAst) {
    cy.findByText(docAst.meta.id).click();
  },
};

export const documentsList = {
  show,
  close: closeModal,
  select,
};
