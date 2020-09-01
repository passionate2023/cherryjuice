import { CachedDocument } from '::store/ducks/cache/document-cache';
import {
  DocumentInPath,
  extractDocumentFromPathname,
} from '::root/components/app/components/editor/hooks/document-routing/helpers/extract-document-from-pathname';
import { useEffect, useRef } from 'react';
import { router } from '::root/router/router';
import { ac, Store } from '::store/store';
import { waitForDocumentToLoad } from '::root/components/app/components/editor/hooks/document-routing/helpers/wait-for-document-to-load';
import { useSelector } from 'react-redux';
import { TAlert } from '::types/react';

const emptyPathname = {
  documentId: undefined,
  node_id: undefined,
};

export const useDocumentRouting = (
  document: CachedDocument,
  currentDocumentId: string,
) => {
  const alert = useSelector<Store>(state => state.dialogs.alert) as TAlert;
  const documentId = document?.id || currentDocumentId;
  const node_id = document?.state?.selectedNode_id;
  const recentNodes = document?.state?.recentNodes;

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
        initialPathname.current = emptyPathname;
        if (node_id) {
          ac.node.select({ documentId, node_id });
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const previousAlert = useRef<TAlert>();
  useEffect(() => {
    if (documentId) {
      if (initialPathname.current.documentId !== documentId)
        router.goto.document(documentId);
    } else if (alert) {
      initialPathname.current = emptyPathname;
      router.goto.home();
    } else if (!initialPathname.current.documentId) {
      if (previousAlert.current?.action?.name !== 'select a document')
        ac.dialogs.showDocumentList();
      router.goto.home();
    }
    previousAlert.current = alert;
  }, [documentId, alert]);

  useEffect(() => {
    if (node_id && !initialPathname.current.node_id) {
      router.goto.node(documentId, node_id);
    }
  }, [node_id, documentId, recentNodes]);
};
