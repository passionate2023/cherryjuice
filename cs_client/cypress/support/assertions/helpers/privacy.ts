import { DocumentAst } from '../../../fixtures/document/generate-document';
import { wait } from '../../helpers/cypress-helpers';
import { puppeteer } from '../../workflows/document/puppeteer';
import { assert } from '../assertions';

export const documentIsPrivate = (docAst: DocumentAst) => {
  puppeteer.auth.signOut();
  cy.visit('/');
  wait.s1;
  cy.visit(`/document/${docAst.meta.id}`);
  cy.get('#login-password');
};

export const documentIsPublic = (docAst: DocumentAst) => {
  puppeteer.auth.signOut();
  puppeteer.navigate.goToDocument(docAst);
  assert.documentContent(docAst);
};
