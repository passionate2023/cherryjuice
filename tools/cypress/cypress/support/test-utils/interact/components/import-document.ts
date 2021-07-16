import { testIds } from '@cherryjuice/test-ids';
import { wait } from '../../../helpers/cypress-helpers';
import { interact } from '../interact';

const show = () => {
  interact.documentsList.show();
  cy.findByTestId(testIds.dialogs__selectDocument__footerLeft__import).click();
  wait.ms500();
};

export const importDocument = {
  show,
};
