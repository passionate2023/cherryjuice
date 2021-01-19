import { extractDocumentFromPathname } from '@cherryjuice/shared-helpers';
import { ac } from '::store/store';
import { extractFolderFromPathname } from '::app/components/editor/hooks/router-effect/helpers/extract-folder-from-path';

const folder = () => {
  const { folder } = extractFolderFromPathname();
  if (!folder) ac.document.setDocumentId('');
  if (folder) ac.home.selectFolder(folder);
};

const initial = () => {
  const { documentId, node_id, hash } = extractDocumentFromPathname();
  if (documentId) {
    ac.document.setDocumentId(documentId);
    if (node_id) ac.node.selectNext({ documentId, node_id, hash });
  } else folder();
};
const change = () => {
  const { documentId, node_id } = extractDocumentFromPathname();
  if (node_id) ac.node.select({ documentId, node_id });
  else if (documentId) ac.document.setDocumentId(documentId);
  else folder();
};

export const routerToState = (): void => {
  initial();
  window.onpopstate = change;
};
