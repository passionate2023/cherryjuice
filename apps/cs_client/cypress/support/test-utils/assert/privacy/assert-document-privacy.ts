import { Privacy } from '@cherryjuice/graphql-types';
import { DocumentAst } from '../../../../fixtures/document/generate-document';
import { puppeteer } from '../../puppeteer/puppeteer';
import { wait } from '../../../helpers/cypress-helpers';
import { assert } from '../assert';

const assertPublicDocument = (docAst: DocumentAst) => {
  puppeteer.auth.signOut();
  puppeteer.navigate.goToDocument(docAst);
  cy.get('.tree');
};

const assertPrivateDocument = (docAst: DocumentAst) => {
  puppeteer.auth.signOut();
  cy.visit('/');
  wait.s1;
  cy.visit(`/document/${docAst.meta.id}`);
  cy.get('#login-password');
};

export const assertDocumentPrivacy = (docAst: DocumentAst) => {
  if (docAst.meta.privacy === Privacy.PRIVATE) {
    assertPrivateDocument(docAst);
  } else if (docAst.meta.privacy === Privacy.PUBLIC) {
    assertPublicDocument(docAst);
    assert.documentContent(docAst);
  } else if (docAst.meta.privacy === Privacy.GUESTS_ONLY)
    assertPrivateDocument(docAst);
};
