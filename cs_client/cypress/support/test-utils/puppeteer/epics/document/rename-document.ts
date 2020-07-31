import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { interact } from '../../../interact/interact';

export const renameDocument = (document: DocumentAst, newName: string) => {
  interact.documentMeta.show(document);
  interact.documentMeta.set.name(newName);
  interact.documentMeta.apply();
  interact.documentsList.close();
  document.meta.name = newName;
};
