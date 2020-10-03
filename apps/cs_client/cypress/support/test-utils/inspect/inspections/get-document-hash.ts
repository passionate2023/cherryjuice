import { DocumentAst } from '../../../../fixtures/document/generate-document';
import { interact } from '../../interact/interact';
import { inspect } from '../inspect';

export const assignDocumentHashAndIdToAst = (documents: DocumentAst[]) => {
  interact.documentsList.show();
  documents.forEach(document => {
    inspect.getDocumentInfo(document.meta).then(({ id, hash }) => {
      document.meta.id = id;
      document.meta.hash = hash;
    });
  });
  interact.documentsList.close();
};
