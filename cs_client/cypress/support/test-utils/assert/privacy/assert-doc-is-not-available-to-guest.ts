import { DocumentAst } from '../../../../fixtures/document/generate-document';
import { UserCredentials } from '../../../../fixtures/auth/login-credentials';
import { puppeteer } from '../../puppeteer/puppeteer';
import { wait } from '../../../helpers/cypress-helpers';

export const assertDocIsNotAvailableToGuest = (
  docAst: DocumentAst,
  { user }: { writeAccess: boolean; user: UserCredentials },
) => {
  puppeteer.auth.signIn(user, false);
  cy.visit('/');
  wait.s1;
  cy.visit(`/document/${docAst.meta.id}`);
  cy.contains('does not exist in your library', { timeout: 20000 });
};
