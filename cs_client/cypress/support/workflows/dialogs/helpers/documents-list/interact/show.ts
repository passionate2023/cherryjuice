import { testIds } from '../../../../../helpers/test-ids';
import { wait } from '../../../../../helpers/cypress-helpers';

const show = () => {
  cy.findByTestId(testIds.toolBar__navBar__showDocumentList).click();
  wait.ms500();
};

export { show };
