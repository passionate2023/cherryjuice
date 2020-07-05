import { dialogs } from '../../dialogs';
import { testIds } from '../../../../helpers/test-ids';
import { wait } from '../../../../helpers/cypress-helpers';

export const showImportDocument = () => {
  dialogs.documentsList.show();
  cy.findByTestId(testIds.dialogs__selectDocument__footerLeft__import).click();
  wait.ms500();
};
