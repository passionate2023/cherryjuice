import { UserCredentials } from '../../../../fixtures/auth/login-credentials';
import { puppeteer } from '../../puppeteer/puppeteer';
import { wait } from '../../../helpers/cypress-helpers';
import { interact } from '../../interact/interact';
import { inspect } from '../../inspect/inspect';

export const assertGuestHasNDocuments = (
  nOfDocuments: number,
  user: UserCredentials,
) => {
  puppeteer.auth.signIn(user, false);
  interact.documentsList.show();
  wait.s1;
  inspect.getNumberOfDocuments().then(n => {
    expect(n).to.equal(nOfDocuments);
  });
  interact.documentsList.close();
};
