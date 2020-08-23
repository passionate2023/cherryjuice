import { documentActionCreators } from '::root/components/app/components/editor/document/reducer/action-creators';
import { onpaste } from './editing/clipboard';

const testCallbacks = {
  documentActionCreators: {
    pastedImages: documentActionCreators.pastedImages,
  },
  clipboard: {
    onpaste,
  },
};
type TestCallbacks = typeof testCallbacks;

const attachTestCallbacks = () => {
  // @ts-ignore
  window.__testCallbacks = testCallbacks;
};

export { attachTestCallbacks };
export { TestCallbacks };
