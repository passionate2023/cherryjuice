export const goToLogin = () => {
  cy.visit('/auth/login');
  cy.get('#login-password', { timeout: 20000 });
};
