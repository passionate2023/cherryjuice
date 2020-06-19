import { testIds } from '../helpers/test-ids';
import { wait } from '../helpers/cypress-helpers';

export const applyDocumentMeta = () => {
  cy.findByTestId(testIds.documentMeta__apply).click();
  wait.s1();
};

export const setDocumentName = (name: string) => {
  cy.findByTestId(testIds.documentMeta__documentName)
    .clear()
    .type(name);
};

export const createDocument = ({ name }: { name: string }) => {
  cy.findByTestId('new-document').click();
  wait.ms500();
  setDocumentName(name);
  applyDocumentMeta();
};
