import { puppeteer } from '../../support/test-utils/puppeteer/puppeteer';
import { users } from '../../fixtures/auth/login-credentials';

describe('login', () => {
  it('login', () => {
    puppeteer.auth.signIn(users.user0);
  });
});
