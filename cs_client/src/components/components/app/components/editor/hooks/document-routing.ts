import { CachedDocument } from '::store/ducks/cache/document-cache';
import { useEffect, useRef } from 'react';
import { ac, store } from '::store/store';
import { interval } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { router } from '::root/router/router';
import { getDefaultSelectedNode_id } from '::store/ducks/cache/document-cache/helpers/document/shared/get-default-selected-node_id';

const getDocumentIdAndNode_idFromPathname = () => {
  const params = /\/document\/([^/]*)\/node\/([\d]*)/.exec(location.pathname);
  if (params) {
    const documentId = params && params[1];
    const node_id = params && +params[2];
    return { documentId, node_id };
  } else {
    const params = /\/document\/([^/]*)/.exec(location.pathname);
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
  const pathnameParams = useRef(false);
  useEffect(() => {
    const {
      documentId: file_id,
      node_id,
    } = getDocumentIdAndNode_idFromPathname();
    if (file_id) pathnameParams.current = true;
    if (file_id && file_id !== documentId) ac.document.setDocumentId(file_id);
    if (node_id && node_id !== selectedNode_id) {
      pendingNode_id.current = true;
      const selectNode = interval(5)
        .pipe(
          filter(() => getCurrentDocument(store.getState())?.id === file_id),
          take(1),
          tap(() => {
            pendingNode_id.current = false;
            pathnameParams.current = false;
            ac.document.selectNode({ documentId: file_id, node_id });
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
      if (selectedNode_id) {
        if (!pendingNode_id.current) {
          // select the node_id to trigger fetching html on the first run
          ac.document.selectNode({
            documentId,
            node_id: selectedNode_id,
          });
          router.goto.node(documentId, selectedNode_id);
        }
      } else if (
        document?.nodes &&
        document.nodes[0]?.child_nodes?.length > 0
      ) {
        ac.document.selectNode({
          documentId,
          node_id: getDefaultSelectedNode_id(document.nodes),
        });
      }
    } else if (!pathnameParams.current) router.goto.home();
  }, [documentId, selectedNode_id, document?.nodes]);
};

export { useDocumentRouting };
