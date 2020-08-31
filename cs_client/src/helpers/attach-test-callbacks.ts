import { documentActionCreators } from '::root/components/app/components/editor/document/reducer/action-creators';
import { onpaste } from './editing/clipboard';
import { apolloClient } from '::graphql/client/apollo-client';
import { snapBackManager } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/undo-redo';
import { dmTM, nmTM } from '::store/ducks/cache/document-cache';

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
  window['__testCallbacks'] = testCallbacks;
  window['__APOLLO_CACHE__'] = apolloClient;
  window['snapBackManager'] = snapBackManager;
  window['nmTM'] = nmTM;
  window['dmT'] = dmTM;
}
export { TestCallbacks };
