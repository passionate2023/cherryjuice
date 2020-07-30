import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { testIds } from '../../../../helpers/test-ids';
import { inspect } from '../../../../inspect/inspect';

export const saveDocument = (documents: DocumentAst[]) => {
  cy.findByTestId(testIds.toolBar__main__saveDocument).click();
  cy.contains('Document saved', { timeout: 10000 });
  documents.forEach(document => {
    document.meta.unsaved = false;
  });
  inspect.assignDocumentHashAndIdToAst(documents);
};
