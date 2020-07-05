import { wait } from '../../../../../helpers/cypress-helpers';
import { applyDocumentMeta, setDocumentName } from './helpers';

// const assignId = (meta: { id: string }) => {
//   cy.location().then(location => {
//     meta.id = /document\/([^/]+)/.exec(location.pathname)[1];
//   });
// };

const createDocument = (meta: { name: string; id: string }) => {
  cy.findByTestId('new-document').click();
  wait.ms500();
  setDocumentName(meta.name);
  applyDocumentMeta();
};

export { createDocument };
