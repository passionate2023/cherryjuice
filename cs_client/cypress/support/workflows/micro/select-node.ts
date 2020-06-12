import { wait } from '../../helpers/cypress-helpers';

export const selectNode = ({ name }) => {
  cy.get('.tree')
    .findAllByText(name)
    .first()
    .click();
  wait.ms500();
};
