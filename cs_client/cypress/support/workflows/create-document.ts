import { testIds } from '../helpers/test-ids';
import { wait } from '../helpers/cypress-helpers';

export const createDocument = () => {
  cy.findByTestId('close-document-select', { timeout: 20000 }).click();
  wait.ms500();
  cy.findByTestId('new-document').click();
  wait.ms500();
  cy.findByTestId(testIds.documentMeta__apply).click();
  wait.s1();
};
