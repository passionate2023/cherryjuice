import { wait } from '../../../../../helpers/cypress-helpers';

const close = () => {
  cy.get('body').type('{esc}');
  wait.s1;
};

export { close };
