import { apolloClient } from '::graphql/client/apollo-client';
import { dTM } from '::store/ducks/document-cache/document-cache';
import { ac } from '::store/store';
import { execK, snapBackManager, _onPaste } from '@cherryjuice/editor';

const testCallbacks = {
  clipboard: {
    onpaste: _onPaste,
  },
};
type TestCallbacks = typeof testCallbacks;

if (process.env.NODE_ENV === 'development') {
  window['__testCallbacks'] = testCallbacks;
  window['__APOLLO_CACHE__'] = apolloClient;
  window['snapBackManager'] = snapBackManager;
  window['dTM'] = dTM;
  window['sof'] = () => {
    ac.root.setNetworkStatus(false);
  };

  window['son'] = () => {
    ac.root.setNetworkStatus(true);
  };
  window['execk'] = execK;
}
export { TestCallbacks };
