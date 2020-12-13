import { useEffect } from 'react';
import { extractDocumentFromPathname } from '@cherryjuice/shared-helpers';
import { ac, store, Store } from '::store/store';
import { createSelector } from 'reselect';
import { router } from '::root/router/router';

const getRoute = createSelector(
  (state: Store) =>
    state.documentCache.documents[state.document.documentId]?.id,
  (state: Store) =>
    state.documentCache.documents[state.document.documentId]?.persistedState
      ?.selectedNode_id,
  (state: Store) =>
    state.documentCache.documents[state.document.documentId]?.localState?.hash,
  (state: Store) => state.document.asyncOperations.fetch,
  (state: Store) => state.auth.user?.id,
  (state: Store) => state.auth.user?.hasPassword,
  (state: Store) => state.auth.resetPasswordToken,
  (
    documentId,
    node_id,
    hash,
    fetch,
    userId,
    hasPassword,
    resetPasswordToken,
  ) => {
    const unfinishedOauthSignup = userId && hasPassword === false;

    if (unfinishedOauthSignup) router.goto.oauthSignup();
    else if (resetPasswordToken) router.goto.resetPassword();
    else {
      const loggedInUser =
        userId && /\/auth\/(login|signup)/.test(location.pathname);
      if (loggedInUser) router.goto.home();
      else if (fetch === 'idle') {
        if (documentId) {
          if (node_id) {
            router.goto.node(documentId, node_id, hash);
          } else router.goto.document(documentId);
        } else {
          if (!userId) router.goto.signIn();
          else {
            router.goto.home();
          }
        }
      }
    }
  },
);

const reflectState = () => getRoute(store.getState());

const initial = () => {
  const { documentId, node_id, hash } = extractDocumentFromPathname();
  if (documentId) {
    ac.document.setDocumentId(documentId);
    if (node_id) ac.node.selectNext({ documentId, node_id, hash });
  } else ac.document.setDocumentId('');
};
const change = () => {
  const { documentId, node_id } = extractDocumentFromPathname();
  if (node_id) ac.node.select({ documentId, node_id });
  else if (documentId) ac.document.setDocumentId(documentId);
  else ac.document.setDocumentId('');
};

const routerToState = (): void => {
  initial();
  window.onpopstate = change;
};

const stateToRouter = (): void => {
  reflectState();
  store.subscribe(reflectState);
};

const useRouterEffect = () => {
  useEffect(() => {
    routerToState();
    stateToRouter();
  }, []);
};

export { useRouterEffect };
