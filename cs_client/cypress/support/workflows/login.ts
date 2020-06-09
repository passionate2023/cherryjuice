export const login = () => {
  cy.visit(`/`);
  cy.get('.login__form__input--submit').click();
  cy.get('.tool-bar', { timeout: 20000 });
};
