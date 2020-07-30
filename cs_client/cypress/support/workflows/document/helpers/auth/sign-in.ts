import { wait } from '../../../../helpers/cypress-helpers';
import { dialogs } from '../../../dialogs/dialogs';
import { UserCredentials } from '../../../../../fixtures/auth/login-credentials';
import { puppeteer } from '../../puppeteer';

export const signIn = (
  { username, password }: UserCredentials,
  closeDocumentsList = true,
) => {
  cy.window().then(window => {
    let token;
    const auth = window.localStorage.getItem('persist:auth');
    if (auth?.startsWith('{')) token = JSON.parse(auth).token;
    if (!token) {
      cy.clearLocalStorage();
      puppeteer.navigate.goToLogin();
      cy.get('#login-username')
        .clear()
        .type(username);
      cy.get('#login-password')
        .clear()
        .type(password);
      cy.get('.login__form__input--submit', { timeout: 20000 }).click();
      cy.get('.tool-bar', { timeout: 20000 });
      wait.s1;

      if (closeDocumentsList) dialogs.documentsList.close();
    }
  });
};
