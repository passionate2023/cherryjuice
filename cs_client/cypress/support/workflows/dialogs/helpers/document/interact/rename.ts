import { dialogs } from '../../../dialogs';
import { applyDocumentMeta, setDocumentName } from './helpers';

const renameDocument = ({
  currentName,
  newName,
}: {
  currentName: string;
  newName: string;
}) => {
  dialogs.documentsList.interact.showDocumentMetaDialog(currentName);
  setDocumentName(newName);
  applyDocumentMeta();
  dialogs.documentsList.interact.close();
};

export { renameDocument };
