import { DocumentAst } from '../../../fixtures/document/generate-document';
import { dialogs } from '../../workflows/dialogs/dialogs';

export const assignDocumentHashAndIdToAst = (documents: DocumentAst[]) => {
  dialogs.documentsList.show();
  documents.forEach(document => {
    dialogs.documentsList.inspect
      .getDocumentInfo(document.meta)
      .then(({ id, hash }) => {
        document.meta.id = id;
        document.meta.hash = hash;
      });
  });
  dialogs.documentsList.close();
};
