import { UserCredentials } from '../../../../../fixtures/auth/login-credentials';
import { puppeteer } from '../../../../workflows/document/puppeteer';
import { dialogs } from '../../../../workflows/dialogs/dialogs';
import { wait } from '../../../../helpers/cypress-helpers';

export const assertGuestHasNDocuments = (
  nOfDocuments: number,
  user: UserCredentials,
) => {
  puppeteer.auth.signIn(user, false);
  dialogs.documentsList.show();
  wait.s1;
  dialogs.documentsList.inspect.getNumberOfDocuments().then(n => {
    expect(n).to.equal(nOfDocuments);
  });
  dialogs.documentsList.close();
};
