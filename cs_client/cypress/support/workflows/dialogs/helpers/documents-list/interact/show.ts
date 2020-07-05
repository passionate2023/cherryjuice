import { testIds } from '../../../../../helpers/test-ids';
import { wait } from '../../../../../helpers/cypress-helpers';

export const showDocumentsList = () => {
  cy.findByTestId(testIds.toolBar__navBar__showDocumentList).click();
  wait.ms500();
};
