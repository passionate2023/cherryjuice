import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { testIds } from '@cherryjuice/test-ids';
import { wait } from '../../../../helpers/cypress-helpers';
import { puppeteer } from '../../puppeteer';
import { UserCredentials } from '../../../../../fixtures/auth/login-credentials';

export const exportDocument = (
  document: DocumentAst,
  user: UserCredentials,
) => {
  // documentPuppeteer.goToDocument(document); //todo select document by opening it
  puppeteer.auth.signIn(user, false);
  puppeteer.manage.selectDocument(document);
  // documentPuppeteer.selectDocument(document)
  cy.findByTestId(testIds.toolBar__navBar__exportDocument).click();
  cy.contains('finished', { timeout: 60000 });
  cy.findByTestId(
    testIds.popups__documentOperations__downloadDocument + document.meta.id,
  ).click();
  wait.s1;
  cy.findByTestId(testIds.popups__documentOperations__clearAllFinished).click();
  wait.s5();
};
