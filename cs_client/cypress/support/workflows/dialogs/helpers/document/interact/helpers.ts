import { testIds } from '../../../../../helpers/test-ids';
import { wait } from '../../../../../helpers/cypress-helpers';

const applyDocumentMeta = () => {
  cy.findByTestId(testIds.documentMeta__apply).click();
  wait.s1;
  wait.ms500();
};

const setDocumentName = (name: string) => {
  cy.findByTestId(testIds.documentMeta__documentName)
    .clear()
    .type(name);
};

export { applyDocumentMeta, setDocumentName };
