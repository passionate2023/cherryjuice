import { wait } from '../../../helpers/cypress-helpers';

export const closeModal = () => {
  cy.get('body').type('{esc}');
  wait.s1;
};
