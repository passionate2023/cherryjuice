import { documentActionCreators } from '::root/components/app/components/editor/document/reducer/action-creators';
import { onpaste } from './editing/clipboard';
import { apolloClient } from '::graphql/client/apollo-client';
import { snapBackManager } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/undo-redo';

const testCallbacks = {
  documentActionCreators: {
    pastedImages: documentActionCreators.pastedImages,
  },
  clipboard: {
    onpaste,
  },
};
type TestCallbacks = typeof testCallbacks;

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  window.__testCallbacks = testCallbacks;
  // @ts-ignore
  window.__APOLLO_CACHE__ = apolloClient;
  // @ts-ignore
  window.snapBackManager = snapBackManager;
}
export { TestCallbacks };
