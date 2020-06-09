import { wait } from '../helpers/cypress-helpers';

export const goHome = () => {
  cy.visit(`/`);
  wait.s1();
};
