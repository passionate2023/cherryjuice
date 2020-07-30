import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { dialogs } from '../../../dialogs/dialogs';

export const renameDocument = (document: DocumentAst, newName: string) => {
  dialogs.documentMeta.show(document);
  dialogs.documentMeta.setName(newName);
  dialogs.documentMeta.apply();
  dialogs.documentsList.close();
  document.meta.name = newName;
};
