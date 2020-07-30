import { testIds } from '../../../../../helpers/test-ids';
import { wait } from '../../../../../helpers/cypress-helpers';

export const showDocumentsList = () => {
  cy.findByTestId(testIds.toolBar__navBar__showDocumentList, {
    timeout: 20000,
  }).click({ force: true });
  wait.s1;
};
