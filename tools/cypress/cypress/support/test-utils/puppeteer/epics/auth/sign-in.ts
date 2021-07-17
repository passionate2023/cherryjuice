import { wait } from '../../../../helpers/cypress-helpers';
import { UserCredentials } from '../../../../../fixtures/auth/login-credentials';
import { puppeteer } from '../../puppeteer';
import { interact } from '../../../interact/interact';
import { testIds } from '@cherryjuice/test-ids';

export const signIn = (
  { username, password }: UserCredentials,
  closeDocumentsList = true,
) => {
  cy.window().then(window => {
    let token;
    const auth = window.localStorage.getItem('persist:auth');
    if (auth?.startsWith('{')) token = JSON.parse(auth).token;
    if (!token) {
      puppeteer.navigate.goToLogin();
      cy.get('#login-username',{}).clear().type(username);
      cy.get('#login-password').clear().type(password);
      cy.get('input[type="submit"]', { timeout: 20000 }).click();
      cy.findByTestId(testIds.toolBar__navBar__userButton, { timeout: 20000 });
      wait.s1;

      if (closeDocumentsList) interact.documentsList.close();
    }
  });
};
