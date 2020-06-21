import { wait } from '../../../../../helpers/cypress-helpers';
import { applyDocumentMeta, setDocumentName } from './helpers';

const createDocument = ({ name }: { name: string }) => {
  cy.findByTestId('new-document').click();
  wait.ms500();
  setDocumentName(name);
  applyDocumentMeta();
};

export { createDocument };
