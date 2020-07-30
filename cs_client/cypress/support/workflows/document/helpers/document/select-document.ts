import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { dialogs } from '../../../dialogs/dialogs';
import { testIds } from '../../../../helpers/test-ids';
import { wait } from '../../../../helpers/cypress-helpers';

export const selectDocument = (docAst: DocumentAst) => {
  dialogs.documentsList.show();
  dialogs.documentsList.selectDocument(docAst);
  cy.findByTestId(testIds.dialogs__selectDocument__footerRight__open).click();
  wait.ms500();
  dialogs.documentsList.close();
};
