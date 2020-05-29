export const selectNode = ({ name }) => {
  cy.get('.tree')
    .findAllByText(name)
    .first()
    .click();
};
