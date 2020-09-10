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
  (state: Store) => state.documentCache[state.document.documentId]?.id,
  (state: Store) =>
    state.documentCache[state.document.documentId]?.persistedState?.selectedNode_id,
  (state: Store) => state.document.asyncOperations.fetch,
  (state: Store) => state.auth.user?.id,
  (state: Store) => state.auth.user?.hasPassword,
  (documentId, node_id, fetch, userId, hasPassword) => {
    const unfinishedOauthSignup = userId && hasPassword === false;

    if (unfinishedOauthSignup) router.goto.oauthSignup();
    else if (fetch === 'idle') {
      if (documentId) {
        if (node_id) {
          router.goto.node(documentId, node_id);
        } else router.goto.document(documentId);
      } else if (!userId) router.goto.signIn();
      else {
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
