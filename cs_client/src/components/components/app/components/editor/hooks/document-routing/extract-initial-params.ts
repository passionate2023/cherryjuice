import { useEffect } from 'react';
import { ac } from '::store/store';
import { extractDocumentFromPathname } from '::root/components/app/components/editor/hooks/document-routing/helpers/extract-document-from-pathname';

const useExtractInitialParams = () => {
  useEffect(() => {
    const { documentId, node_id } = extractDocumentFromPathname();
    if (documentId) {
      if (documentId.startsWith('new-document')) {
        ac.document.setDocumentId('');
      } else {
        ac.document.setDocumentId(documentId);
        if (node_id) ac.node.selectNext({ documentId, node_id });
      }
    } else ac.document.setDocumentId('');
  }, []);
};

export { useExtractInitialParams };
