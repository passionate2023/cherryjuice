export const login = () => {
  cy.get('.login__form__input--submit').click();
  cy.get('.tool-bar', { timeout: 20000 });
};
