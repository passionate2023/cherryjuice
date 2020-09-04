import { useEffect } from 'react';
import { extractDocumentFromPathname } from '::root/components/app/components/editor/hooks/document-routing/helpers/extract-document-from-pathname';
import { ac } from '::store/store';

const initial = () => {
  const { documentId, node_id } = extractDocumentFromPathname();
  if (documentId) {
    if (documentId.startsWith('new-document')) {
      ac.document.setDocumentId('');
    } else {
      ac.document.setDocumentId(documentId);
      if (node_id) ac.node.selectNext({ documentId, node_id });
    }
  } else ac.document.setDocumentId('');
};
const change = () => {
  const { documentId, node_id } = extractDocumentFromPathname();
  if (node_id) ac.node.select({ documentId, node_id });
  else if (documentId) ac.document.setDocumentId(documentId);
  else ac.document.setDocumentId('');
};
const useHistoryChange = () => {
  useEffect(() => {
    window.onpopstate = change;
    initial();
  }, []);
};

export { useHistoryChange };
