import { wait } from '../../helpers/cypress-helpers';

export const focusEditor = () => {
  cy.get('#rich-text').focus();
  wait.ms250();
};
