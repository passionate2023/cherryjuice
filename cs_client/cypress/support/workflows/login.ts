export const login = () => {
  cy.get('.login__form__input--submit', { timeout: 20000 }).click();
  cy.get('.tool-bar', { timeout: 20000 });
};
