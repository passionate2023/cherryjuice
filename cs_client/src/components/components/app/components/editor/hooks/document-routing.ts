import { CachedDocument } from '::store/ducks/cache/document-cache';
import { useEffect, useRef } from 'react';
import { ac, store } from '::store/store';
import { interval } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { router } from '::root/router/router';
import { getDefaultSelectedNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-selected-node_id';

export const getDocumentIdAndNode_idFromPathname = (
  pathname = location.pathname,
) => {
  const params = /\/document\/([^/]*)\/node\/([\d]*)/.exec(pathname);
  if (params) {
    const documentId = params && params[1];
    const node_id = params && +params[2];
    return { documentId, node_id };
  } else {
    const params = /\/document\/([^/]*)/.exec(pathname);
    const documentId = params && params[1];
    return { documentId, node_id: 0 };
  }
};

const useDocumentRouting = (
  document: CachedDocument,
  currentDocumentId: string,
) => {
  const documentId = currentDocumentId;
  const selectedNode_id = document?.state?.selectedNode_id;
  useEffect(() => {
    ac.document.setDocumentId(documentId);
  }, []);
  const pendingNode_id = useRef(false);
  const pendingPathnameRedirect = useRef(false);
  useEffect(() => {
    const {
      documentId: file_id,
      node_id,
    } = getDocumentIdAndNode_idFromPathname();
    if (file_id?.startsWith('new-document')) return;
    if (file_id && file_id !== documentId) {
      if (file_id) pendingPathnameRedirect.current = true;
      ac.document.setDocumentId(file_id);
    }
    if (node_id && node_id !== selectedNode_id) {
      pendingNode_id.current = true;
      const selectNode = interval(5)
        .pipe(
          filter(() => getCurrentDocument(store.getState())?.id === file_id),
          take(1),
          tap(() => {
            pendingNode_id.current = false;
            pendingPathnameRedirect.current = false;
            ac.node.select({ documentId: file_id, node_id });
          }),
        )
        .subscribe();
      return () => {
        selectNode.unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    if (documentId) {
      const NEW_DOCUMENT = documentId?.startsWith('new-document') && document;
      const FETCHED_DOCUMENT = !documentId.startsWith('new-document');
      const SELECTED_NODE = selectedNode_id && !pendingNode_id.current;
      if (NEW_DOCUMENT) {
        const NEW_DOCUMENT_NEW_NODE = NEW_DOCUMENT && SELECTED_NODE;
        const NEW_DOCUMENT_NO_NODE = NEW_DOCUMENT && !SELECTED_NODE;
        if (NEW_DOCUMENT_NEW_NODE)
          router.goto.node(documentId, selectedNode_id);
        else if (NEW_DOCUMENT_NO_NODE) router.goto.document(documentId);
      } else {
        const TREE_POPULATED =
          document?.nodes && document.nodes[0]?.child_nodes?.length > 0;
        const FETCHED_DOC_NEW_NODE = FETCHED_DOCUMENT && SELECTED_NODE;
        const FETCHED_DOCUMENT_NO_NODE_TREE =
          FETCHED_DOCUMENT && !SELECTED_NODE && TREE_POPULATED;
        const FETCHED_DOCUMENT_NO_NODE_NO_TREE =
          FETCHED_DOCUMENT && !SELECTED_NODE && !TREE_POPULATED;

        if (FETCHED_DOC_NEW_NODE) router.goto.node(documentId, selectedNode_id);
        else if (FETCHED_DOCUMENT_NO_NODE_TREE)
          ac.node.select({
            documentId,
            node_id: getDefaultSelectedNode_id(document.nodes),
          });
        else if (FETCHED_DOCUMENT_NO_NODE_NO_TREE)
          router.goto.document(documentId);
      }
    } else if (!pendingPathnameRedirect.current) {
      ac.dialogs.showDocumentList();
      router.goto.home();
    }
  }, [documentId, selectedNode_id, document?.nodes]);
};

export { useDocumentRouting };
