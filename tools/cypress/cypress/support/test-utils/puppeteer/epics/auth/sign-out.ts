import { testIds } from '@cherryjuice/test-ids';

export const signOut = () => {
  cy.window().then(window => {
    let token;
    const auth = window.localStorage.getItem('persist:auth');
    if (auth?.startsWith('{')) token = JSON.parse(auth).token;
    if (token) {
      cy.findByTestId(testIds.toolBar__navBar__userButton).click();
      cy.findByTestId(testIds.toolBar__userPopup__signOut).click();
      cy.clearLocalStorage();
      cy.get('#login-username');
    }
  });
  cy.clearLocalStorage();
};
