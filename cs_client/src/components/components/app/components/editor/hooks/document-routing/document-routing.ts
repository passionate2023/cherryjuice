import { CachedDocument } from '::store/ducks/cache/document-cache';
import {
  DocumentInPath,
  extractDocumentFromPathname,
} from '::root/components/app/components/editor/hooks/document-routing/helpers/extract-document-from-pathname';
import { useEffect, useRef } from 'react';
import { router } from '::root/router/router';
import { ac } from '::store/store';
import { waitForDocumentToLoad } from '::root/components/app/components/editor/hooks/document-routing/helpers/wait-for-document-to-load';

const emptyPathname = {
  documentId: undefined,
  node_id: undefined,
};

export const useDocumentRouting = (
  document: CachedDocument,
  currentDocumentId: string,
) => {
  const documentId = document?.id || currentDocumentId;
  const node_id = document?.state?.selectedNode_id;

  const initialPathname = useRef<DocumentInPath>();
  if (!initialPathname.current) {
    initialPathname.current = extractDocumentFromPathname();
    if (initialPathname.current.documentId?.startsWith('new-document')) {
      initialPathname.current = emptyPathname;
    }
  }

  useEffect(() => {
    const { documentId, node_id } = initialPathname.current;
    if (documentId) {
      ac.document.setDocumentId(documentId);
      const subscription = waitForDocumentToLoad(documentId, () => {
        if (node_id) {
          ac.node.select({ documentId, node_id });
        }
        initialPathname.current = emptyPathname;
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    if (documentId) {
      if (initialPathname.current.documentId !== documentId)
        router.goto.document(documentId);
    } else if (!initialPathname.current.documentId) {
      ac.dialogs.showDocumentList();
      router.goto.home();
    }
  }, [documentId]);

  useEffect(() => {
    if (node_id && !initialPathname.current.node_id) {
      router.goto.node(documentId, node_id);
    }
  }, [node_id, documentId]);
};
