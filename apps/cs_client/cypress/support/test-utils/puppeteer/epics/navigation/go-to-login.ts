export const goToLogin = () => {
  cy.visit('/');
  cy.get('#login-password');
};
