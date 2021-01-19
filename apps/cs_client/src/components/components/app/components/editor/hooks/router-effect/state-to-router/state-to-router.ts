import { createSelector } from 'reselect';
import { store, Store } from '::store/store';
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
  (state: Store) => state.home.folder,
  (state: Store) => state.home.show,
  (
    documentId,
    node_id,
    hash,
    fetch,
    userId,
    hasPassword,
    resetPasswordToken,
    folder,
    showHome,
  ) => {
    const unfinishedOauthSignup = userId && hasPassword === false;

    if (unfinishedOauthSignup) router.goto.oauthSignup();
    else if (resetPasswordToken) router.goto.resetPassword();
    else {
      const loggedInUser =
        userId && /\/auth\/(login|signup)/.test(location.pathname);
      if (loggedInUser || (userId && showHome)) router.goto.home(folder);
      else if (fetch === 'idle') {
        const isAtHomePage = /\/documents\/.*/.test(location.pathname);
        if (documentId) {
          if (node_id) {
            router.goto.node(documentId, node_id, hash);
          } else router.goto.document(documentId);
        } else {
          if (!userId) router.goto.signIn();
          else {
            if (!isAtHomePage) {
              router.goto.home(folder);
            }
          }
        }
      }
    }
  },
);

const reflectState = () => getRoute(store.getState());

export const stateToRouter = (): void => {
  reflectState();
  store.subscribe(reflectState);
};
