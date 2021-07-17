import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { testIds } from '@cherryjuice/test-ids';
import { wait } from '../../../../helpers/cypress-helpers';
import { interact } from '../../../interact/interact';

export const selectDocument = (docAst: DocumentAst) => {
  interact.documentsList.show();
  interact.documentsList.select.document(docAst);
  cy.findByTestId(testIds.dialogs__selectDocument__footerRight__open).click();
  wait.ms500();
  interact.documentsList.close();
};
