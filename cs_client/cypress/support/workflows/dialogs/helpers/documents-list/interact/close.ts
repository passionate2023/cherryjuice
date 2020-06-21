import { wait } from '../../../../../helpers/cypress-helpers';

const close = () => {
  cy.findByTestId('close-document-select', { timeout: 20000 }).click();
  wait.ms500();
};

export { close };
