import { useEffect } from 'react';
import { extractDocumentFromPathname } from '::root/components/app/components/editor/hooks/router-effect/helpers/extract-document-from-pathname';
import { ac, store, Store } from '::store/store';
import { createSelector } from 'reselect';
import { router } from '::root/router/router';

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

const getRoute = createSelector(
  (state: Store) => state.document.documentId,
  (state: Store) =>
    state.documentCache[state.document.documentId]?.state?.selectedNode_id,
  (state: Store) => state.document.asyncOperations.fetch,
  (documentId, selectedNode_id, fetch) => {
    if (fetch === 'idle') {
      if (documentId) {
        if (selectedNode_id) {
          router.goto.node(documentId, selectedNode_id);
        } else router.goto.document(documentId);
      } else {
        router.goto.home();
      }
    }
  },
);

const routerToState = (): void => {
  initial();
  window.onpopstate = change;
};

const stateToRouter = (): void => {
  store.subscribe(() => getRoute(store.getState()));
};

const useRouterEffect = () => {
  useEffect(() => {
    routerToState();
    stateToRouter();
  }, []);
};

export { useRouterEffect };
