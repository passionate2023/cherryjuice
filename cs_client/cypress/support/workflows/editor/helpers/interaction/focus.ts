import { wait } from '../../../../helpers/cypress-helpers';

const focus = () => {
  cy.get('#rich-text').focus();
  wait.ms250();
};

export { focus };
